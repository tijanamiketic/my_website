import "server-only";
import { profile } from "@/content/profile";
import { courses } from "@/content/courses";
import { interviews } from "@/content/interviews";
import { resources } from "@/content/resources";
import { projects } from "@/content/projects";
import { socials } from "@/content/socials";
import { getChatKnowledge } from "./chat-context";
import { SKOOL_URL, SITE_URL, fullName } from "./config";
import { formatDate } from "./format";

/** Placeholder links ("#") in the content files shouldn't be shown to visitors. */
const realUrl = (u?: string) => !!u && u !== "#";

/**
 * Keyword-based fallback used when ANTHROPIC_API_KEY isn't set (or the API is
 * unreachable). Answers come from the same /content files as the AI prompt.
 */
export async function mockReply(text: string): Promise<string> {
  const t = text.toLowerCase();
  const { upcoming, posts } = await getChatKnowledge();
  const free = courses.filter((c) => c.tier === "free");
  const premium = courses.filter((c) => c.tier === "premium");
  const name = profile.firstName;

  const intents: { k: RegExp; r: () => string }[] = [
    { k: /\b(hi|hello|hey|hej|zdravo|ćao|cao|ciao|hola)\b/, r: () => `Hi! I can tell you about ${name}'s courses, upcoming events, interviews, free resources or how to get in touch. What are you curious about?` },
    { k: /\bfree\b|besplat/, r: () => `Free courses: ${free.map((c) => `${c.title} (${c.duration}, ${c.level})`).join("; ")}. They're all in the Skool community: ${SKOOL_URL}` },
    { k: /(price|cost|paid|premium|how much|€|\$|cena|košta)/, r: () => `Premium courses: ${premium.map((c) => `${c.title} — €${c.price} (${c.duration})`).join("; ")}. Each includes live Q&As and feedback. Enroll on Skool: ${SKOOL_URL}` },
    { k: /(course|learn|class|training|skool|beginner|start|kurs)/, r: () => `New to AI? Start with "${free[0]?.title}" — it's free. For depth, "${premium[0]?.title}" is the flagship. Everything is on Skool: ${SKOOL_URL}` },
    {
      k: /(event|workshop|meetup|live|webinar|when|next|događaj|radionic)/,
      r: () => {
        const e = upcoming[0];
        if (!e) return `There are no events scheduled right now. Subscribe to ${profile.newsletter.title} in the Contact section to hear about the next one.`;
        const more = upcoming.length > 1 ? ` There are ${upcoming.length - 1} more in the Events section.` : "";
        return `Next up: ${e.title} on ${formatDate(e.date)}, ${e.time} CET (${e.mode} · ${e.location})${e.seats ? `, ${e.seats} seats left` : ""}. ${realUrl(e.url) ? `Register: ${e.url}` : "Register in the Events section."}${more}`;
      },
    },
    { k: /(interview|podcast|press|media|featured|radio|video)/, r: () => { const i = interviews.find((x) => x.featured) ?? interviews[0]; return `Latest feature: "${i.title}" on ${i.outlet} (${i.format}, ${i.duration})${realUrl(i.url) ? ` — ${i.url}` : ""}. See all ${interviews.length} appearances in the Interviews section. Press requests: ${profile.email}`; } },
    { k: /(blog|article|post|write|writing|read)/, r: () => `Latest article: "${posts[0]?.title}" (${posts[0]?.readingTime} min read) — ${SITE_URL}/blog/${posts[0]?.slug}` },
    { k: /(resource|pdf|template|guide|download|doc|checklist|notebook)/, r: () => `There are ${resources.length} free resources in the library — try "${resources[0].title}". Use the search in the Resources section to filter by topic.` },
    { k: /(project|built|portfolio|work|app)/, r: () => `Recent projects include ${projects.slice(0, 3).map((p) => p.title).join(", ")}. Scroll to Projects to see them all.` },
    { k: /(contact|email|mail|hire|collab|speak|reach|book|kontakt)/, r: () => `The best way is email: ${profile.email}. For workshops or speaking, include your dates and audience size. You can also find ${name} on ${socials.map((s) => s.name).join(", ")}.` },
    {
      k: /(who|about|background|experience|bio)/,
      r: () =>
        `${fullName} is an ${profile.role} based in ${profile.location} — ${profile.stats.map((s) => `${s.value} ${s.label}`).join(", ")}. ${name} builds agents, RAG systems and AI products, and teaches through courses, cohorts and corporate trainings.`,
    },
  ];

  const hit = intents.find((i) => i.k.test(t));
  return hit
    ? hit.r()
    : `I'm the site's demo assistant, so I know the basics — courses, prices, events, interviews, resources and contact. Try one of the suggestions below, or email ${profile.email}.`;
}
