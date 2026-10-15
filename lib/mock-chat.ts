import "server-only";
import { socials } from "@/content/socials";
import { dictionaries } from "@/content/i18n";
import { getChatKnowledge } from "./chat-context";
import { fullName } from "./config";
import { formatDate } from "./format";
import type { Locale } from "./i18n";

/** Placeholder links ("#") in the content files shouldn't be shown to visitors. */
const realUrl = (u?: string) => !!u && u !== "#";

type Intent = "greet" | "free" | "price" | "course" | "event" | "interview" | "blog" | "resource" | "project" | "contact" | "about";

/** Keywords in English and Serbian; the first matching intent wins. The answer is in the page language. */
const INTENTS: { intent: Intent; k: RegExp }[] = [
  { intent: "greet", k: /\b(hi|hello|hey|hej|zdravo|ćao|cao|ciao|hola|pozdrav)\b/ },
  { intent: "free", k: /\bfree\b|besplat/ },
  { intent: "price", k: /(price|cost|paid|premium|how much|€|\$|cen[aeu]|košta|kosta|koliko)/ },
  { intent: "course", k: /(course|learn|class|training|skool|beginner|start|kurs|obuk|uč|nauč)/ },
  { intent: "event", k: /(event|workshop|meetup|live|webinar|when|next|događaj|dogadjaj|radionic|kada|sledeć|sledec)/ },
  { intent: "interview", k: /(interview|podcast|press|media|featured|radio|video|intervju|podkast|gostovanj|medij)/ },
  { intent: "blog", k: /(blog|article|post|write|writing|read|tekst|član|clan)/ },
  { intent: "resource", k: /(resource|pdf|template|guide|download|doc|checklist|notebook|resurs|šablon|sablon|vodič|vodic|preuz)/ },
  { intent: "project", k: /(project|built|portfolio|work|app|projek|aplikacij)/ },
  { intent: "contact", k: /(contact|email|mail|hire|collab|speak|reach|book|consult|kontakt|konsult|imejl|mejl|saradnj|angaž|angaz)/ },
  { intent: "about", k: /(who|about|background|experience|bio|ko je|biografij|iskustv)/ },
];

/**
 * Keyword-based fallback used when ANTHROPIC_API_KEY isn't set (or the API is
 * unreachable). Answers come from the same /content files as the AI prompt.
 */
export async function mockReply(text: string, locale: Locale): Promise<string> {
  const t = text.toLowerCase();
  const k = await getChatKnowledge(locale);
  const { profile, courses, upcoming, interviews, resources, projects, posts, postUrl } = k;
  const d = dictionaries[locale];
  const courseList = courses.map((c) => c.title).join(", ");
  const name = profile.firstName;
  const s = d.nav.sections;
  const liveSocials = socials.filter((x) => x.url).map((x) => x.name).join(", ");
  const ivDetails = (i: (typeof interviews)[number]) =>
    [d.interviews.format[i.format], i.duration, formatDate(i.date, locale)].filter(Boolean).join(", ");

  const sr: Record<Intent | "fallback", () => string> = {
    greet: () => `Zdravo! Mogu da ti kažem nešto o kursevima, predstojećim događajima, intervjuima, besplatnim resursima ili kako da stupiš u kontakt. Šta te zanima?`,
    free: () => sr.course(),
    price: () => sr.course(),
    course: () => `Kursevi još nisu otvoreni, uskoro stižu: ${courseList}. Cene i upis još nisu objavljeni. Za kurseve, obuke ili saradnju zakaži konsultacije putem imejla: ${profile.email}`,
    event: () => {
      const e = upcoming[0];
      if (!e) return `Trenutno nema zakazanih događaja. Navrati ponovo uskoro ili piši na ${profile.email}.`;
      const more = upcoming.length > 1 ? (realUrl(e.url) ? ` Ostali događaji su u odeljku ${s.events}.` : " Tamo su i ostali događaji.") : "";
      return `Sledeći događaj: ${e.title}, ${formatDate(e.date, locale)}, ${e.time} CET (${d.events.mode[e.mode]} · ${e.location})${e.seats ? `, ${d.events.seatsLeft(e.seats).toLowerCase()}` : ""}. ${realUrl(e.url) ? `Prijava: ${e.url}` : `Prijava je u odeljku ${s.events}.`}${more}`;
    },
    interview: () => {
      const i = interviews.find((x) => x.featured) ?? interviews[0];
      return `Najnovije gostovanje: „${i.title}“ — ${i.outlet} (${ivDetails(i)})${realUrl(i.url) ? ` — ${i.url}` : ""}. ${interviews.length > 1 ? "Sva gostovanja su" : "Više je"} u odeljku ${s.interviews}. Upiti za medije: ${profile.email}`;
    },
    blog: () => `Najnoviji tekst: „${posts[0]?.title}“ (${d.blog.minRead(posts[0]?.readingTime ?? 0)}) — ${postUrl(posts[0]?.slug ?? "")}`,
    resource: () => `Broj besplatnih resursa u biblioteci: ${resources.length}. Probaj „${resources[0].title}“, a pretraga u odeljku ${s.resources} filtrira po temi.`,
    project: () => `Neki od skorašnjih projekata: ${projects.slice(0, 3).map((p) => p.title).join(", ")}. Svi su u odeljku ${s.projects}.`,
    contact: () => `Najbolje je putem imejla: ${profile.email}, tako se zakazuju i konsultacije. Za radionice ili predavanja navedi datume i broj učesnika. Na mrežama: ${liveSocials}.`,
    about: () => `${fullName} — ${profile.role}, ${profile.location}. ${profile.stats.map((x) => `${x.value} ${x.label}`).join(", ")}. Pravi agente, RAG sisteme i AI proizvode i predaje kroz kurseve, grupne programe i korporativne obuke.`,
    fallback: () => `Ja sam demo asistent sajta, pa znam osnove — kurseve, događaje, intervjue, resurse i kontakt. Probaj neki od predloga ispod ili piši na ${profile.email}.`,
  };

  const en: Record<Intent | "fallback", () => string> = {
    greet: () => `Hi! I can tell you about ${name}'s courses, upcoming events, interviews, free resources or how to get in touch. What are you curious about?`,
    free: () => en.course(),
    price: () => en.course(),
    course: () => `The courses aren't open yet. Coming soon: ${courseList}. Prices and enrollment haven't been announced. For courses, training or working together, book a consultation by email: ${profile.email}`,
    event: () => {
      const e = upcoming[0];
      if (!e) return `There are no events scheduled right now. Check back soon, or email ${profile.email}.`;
      const more = upcoming.length > 1 ? ` There are ${upcoming.length - 1} more in the ${s.events} section.` : "";
      return `Next up: ${e.title} on ${formatDate(e.date, locale)}, ${e.time} CET (${d.events.mode[e.mode]} · ${e.location})${e.seats ? `, ${d.events.seatsLeft(e.seats)}` : ""}. ${realUrl(e.url) ? `Register: ${e.url}` : `Register in the ${s.events} section.`}${more}`;
    },
    interview: () => {
      const i = interviews.find((x) => x.featured) ?? interviews[0];
      return `Latest feature: "${i.title}" on ${i.outlet} (${ivDetails(i)})${realUrl(i.url) ? ` — ${i.url}` : ""}. ${interviews.length > 1 ? `See all ${interviews.length} appearances` : "More"} in the ${s.interviews} section. Press requests: ${profile.email}`;
    },
    blog: () => `Latest article: "${posts[0]?.title}" (${d.blog.minRead(posts[0]?.readingTime ?? 0)}) — ${postUrl(posts[0]?.slug ?? "")}`,
    resource: () => `There are ${resources.length} free resources in the library — try "${resources[0].title}". Use the search in the ${s.resources} section to filter by topic.`,
    project: () => `Recent projects include ${projects.slice(0, 3).map((p) => p.title).join(", ")}. Scroll to ${s.projects} to see them all.`,
    contact: () => `The best way is email: ${profile.email}, which is also how to book a consultation. For workshops or speaking, include your dates and audience size. You can also find ${name} on ${liveSocials}.`,
    about: () =>
      `${fullName} is an ${profile.role} based in ${profile.location} — ${profile.stats.map((x) => `${x.value} ${x.label}`).join(", ")}. ${name} builds agents, RAG systems and AI products, and teaches through courses, cohorts and corporate trainings.`,
    fallback: () => `I'm the site's demo assistant, so I know the basics — courses, events, interviews, resources and contact. Try one of the suggestions below, or email ${profile.email}.`,
  };

  const replies = { sr, en }[locale];
  const hit = INTENTS.find((i) => i.k.test(t));
  return replies[hit?.intent ?? "fallback"]();
}
