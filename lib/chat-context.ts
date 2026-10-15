import "server-only";
import { profile as profileSource } from "@/content/profile";
import { courses as courseSource } from "@/content/courses";
import { events as eventSource } from "@/content/events";
import { interviews as interviewSource } from "@/content/interviews";
import { resources as resourceSource } from "@/content/resources";
import { projects as projectSource } from "@/content/projects";
import { socials } from "@/content/socials";
import { dictionaries } from "@/content/i18n";
import { getAllPosts } from "./blog";
import { upcomingEvents } from "./events";
import { SITE_URL, SKOOL_URL, fullName } from "./config";
import { formatDate } from "./format";
import { formatPrice, localePath, localize, type Locale } from "./i18n";

/** Placeholder links ("#") in the content files are replaced with a hint. */
const link = (url: string, fallback: string) => (url && url !== "#" ? url : fallback);

/** Everything the assistant (AI or mock) may say comes from /content, in the page language, so answers stay current. */
export async function getChatKnowledge(locale: Locale) {
  return {
    profile: localize(profileSource, locale),
    courses: localize(courseSource, locale),
    upcoming: localize(await upcomingEvents(eventSource), locale),
    interviews: localize(interviewSource, locale),
    resources: localize(resourceSource, locale),
    projects: localize(projectSource, locale),
    posts: getAllPosts(locale),
    postUrl: (slug: string) => `${SITE_URL}${localePath(locale, `/blog/${slug}`)}`,
  };
}

const REPLY_LANGUAGE: Record<Locale, string> = {
  sr: "The visitor is reading the Serbian version of the site. Reply in Serbian, Latin script, unless the visitor writes in another language; then reply in their language.",
  en: "The visitor is reading the English version of the site. Reply in English unless the visitor writes in another language; then reply in their language.",
};

/**
 * System prompt for the Claude-powered assistant, built from the content files in the page language.
 * Kept byte-stable between requests (no timestamps) so prompt caching hits: one cached prompt per language.
 */
export async function buildSystemPrompt(locale: Locale): Promise<string> {
  const { profile, courses, upcoming, interviews, resources, projects, posts, postUrl } = await getChatKnowledge(locale);
  const t = dictionaries[locale];
  const lines: string[] = [];
  const add = (s = "") => lines.push(s);

  add(`You are the friendly website assistant for ${fullName}, ${profile.role}, on their personal site (${SITE_URL}${localePath(locale, "/")}).`);
  add(`Visitors are potential students, workshop clients, journalists and fellow builders. Help them find courses, events, resources, interviews and ways to get in touch.`);
  add();
  add(`How to answer:`);
  add(`- Keep replies short: 1–4 sentences or a compact list. Plain text only — no markdown headings, tables or bold. Bare URLs are fine; the chat widget makes them clickable.`);
  add(`- Answer only from the facts below. If something isn't covered (e.g. personal details, availability on a specific date, discounts), say you don't know and suggest emailing ${profile.email}.`);
  add(`- Never invent courses, prices, dates, outlets or links.`);
  add(`- Speak about ${profile.firstName} in the third person.`);
  add(`- ${REPLY_LANGUAGE[locale]}`);
  add(`- When you mention a part of the site, use its name as visitors see it: ${Object.values(t.nav.sections).join(", ")}.`);
  add(`- Politely decline unrelated tasks (homework, coding help, general chat) and steer back to what's on this site.`);
  add();
  add(`<profile>`);
  add(`Name: ${fullName} (${profile.location})`);
  add(`Role: ${profile.role}`);
  add(`Tagline: ${profile.tagline.replace(/\*\*/g, "")}`);
  add(`Status: ${profile.status}`);
  add(`Stats: ${profile.stats.map((s) => `${s.value} ${s.label}`).join("; ")}`);
  add(`Bio: ${profile.bio.paragraphs.join(" ")}`);
  add(`What they do: ${profile.pillars.map((p) => `${p.title} — ${p.text}`).join(" ")}`);
  add(`Contact email: ${profile.email}`);
  add(`Skool community (all courses live here): ${SKOOL_URL}`);
  add(`Socials: ${socials.filter((s) => s.url).map((s) => `${s.name} ${s.url}`).join("; ")}`);
  add(`Coming soon (no link yet): ${socials.filter((s) => !s.url).map((s) => s.name).join(", ")}`);
  add(`</profile>`);
  add();
  add(`<courses>`);
  for (const c of courses) {
    add(`- ${c.title} | ${c.tier === "free" ? t.courses.free : `Premium, ${formatPrice(c.price ?? 0, locale)}`} | ${c.level} | ${c.duration} | ${c.description} | ${c.url ?? SKOOL_URL}`);
  }
  add(`</courses>`);
  add();
  add(`<upcoming_events timezone="CET">`);
  if (upcoming.length === 0) add(`(none scheduled right now)`);
  for (const e of upcoming) {
    add(`- ${e.title} | ${formatDate(e.date, locale)} ${e.time} CET | ${t.events.mode[e.mode]} · ${e.location} | ${e.seats ? t.events.seatsLeft(e.seats) : t.events.openToAll} | ${e.description} | register: ${link(e.url, `the ${t.events.register} button in the ${t.nav.sections.events} section`)}`);
  }
  add(`</upcoming_events>`);
  add();
  add(`<interviews_and_press>`);
  for (const i of interviews) {
    const details = [t.interviews.format[i.format], i.duration, formatDate(i.date, locale)].filter(Boolean).join(", ");
    add(`- "${i.title}" — ${i.outlet} (${details}) ${link(i.url, "")}`);
    if (i.quote) add(`  Quote: ${i.quote}`);
    if (i.questions?.length) add(`  Questions answered: ${i.questions.join(" / ")}`);
  }
  add(`</interviews_and_press>`);
  add();
  add(`<free_resources>`);
  for (const r of resources) add(`- ${r.title} | ${t.resources.type[r.type]} · ${r.category} · ${r.size} | ${r.description}`);
  add(`Visitors can search and open all resources in the ${t.nav.sections.resources} section of the site.`);
  add(`</free_resources>`);
  add();
  add(`<projects>`);
  for (const p of projects) add(`- ${p.title} (${p.year}): ${p.description} [${p.tags.join(", ")}]`);
  add(`</projects>`);
  add();
  add(`<blog_posts>`);
  for (const p of posts) add(`- "${p.title}" (${formatDate(p.date, locale)}, ${p.readingTime} min) ${postUrl(p.slug)}`);
  add(`</blog_posts>`);
  return lines.join("\n");
}
