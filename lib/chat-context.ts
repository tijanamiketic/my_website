import "server-only";
import { profile as profileSource } from "@/content/profile";
import { courses as courseSource } from "@/content/courses";
import { eventCategories, events as eventSource } from "@/content/events";
import { interviews as interviewSource } from "@/content/interviews";
import { resourceCategories } from "@/content/resources";
import { projects as projectSource } from "@/content/projects";
import { socials } from "@/content/socials";
import { dictionaries } from "@/content/i18n";
import { getAllPosts } from "./blog";
import { news as newsSource } from "./news";
import { getResources } from "./resources";
import { eventAction, eventDates, upcomingEvents } from "./events";
import { SITE_URL, fullName } from "./config";
import { formatDate } from "./format";
import { localeInfo, localePath, localize, type Locale } from "./i18n";

/** Placeholder links ("#") in the content files are replaced with a hint. */
const link = (url: string, fallback: string) => (url && url !== "#" ? url : fallback);

/** Everything the assistant (AI or mock) may say comes from /content, in the page language, so answers stay current. */
export async function getChatKnowledge(locale: Locale) {
  return {
    profile: localize(profileSource, locale),
    courses: localize(courseSource, locale),
    upcoming: localize(await upcomingEvents(eventSource), locale),
    interviews: localize(interviewSource, locale),
    resources: getResources().map((r) => ({ ...r, category: resourceCategories[r.category][locale] })),
    resourceUrl: (slug: string) => `${SITE_URL}${localePath(locale, `/resources/${slug}`)}`,
    projects: localize(projectSource, locale),
    posts: getAllPosts(locale),
    postUrl: (slug: string) => `${SITE_URL}${localePath(locale, `/blog/${slug}`)}`,
    news: newsSource.getAll(locale),
    newsUrl: (slug: string) => `${SITE_URL}${localePath(locale, `/news/${slug}`)}`,
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
  const { profile, courses, upcoming, interviews, resources, resourceUrl, projects, posts, postUrl, news, newsUrl } = await getChatKnowledge(locale);
  const t = dictionaries[locale];
  const lines: string[] = [];
  const add = (s = "") => lines.push(s);

  add(`You are the friendly website assistant for ${fullName}, ${profile.role}, on their personal site (${SITE_URL}${localePath(locale, "/")}).`);
  add(`Visitors are potential students, workshop clients, journalists and fellow builders. Help them find courses, events, resources, interviews, blog posts, AI news articles and ways to get in touch.`);
  add();
  add(`How to answer:`);
  add(`- Keep replies short: 1–4 sentences or a compact list. Plain text only — no markdown headings, tables or bold. Bare URLs are fine; the chat widget makes them clickable.`);
  add(`- Answer only from the facts below. If something isn't covered (e.g. personal details, availability on a specific date, discounts), say you don't know and suggest emailing ${profile.email}.`);
  add(`- Never invent courses, prices, dates, outlets or links.`);
  add(`- Courses are coming soon: never quote a price or an enrollment link for them. For anything about courses, training or working together, suggest booking a consultation by emailing ${profile.email}.`);
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
  add(`Socials: ${socials.filter((s) => s.url).map((s) => `${s.name} ${s.url}`).join("; ")}`);
  add(`Coming soon (no link yet): ${socials.filter((s) => !s.url).map((s) => s.name).join(", ")}`);
  add(`</profile>`);
  add();
  add(`<courses status="coming soon">`);
  add(`None of these courses is open yet: there are no prices, no enrollment and no links. Describe them only as coming soon.`);
  for (const c of courses) {
    add(`- ${c.title} | ${c.level} | ${c.duration} | ${c.description}`);
  }
  add(`</courses>`);
  add();
  add(`<upcoming_events timezone="CET">`);
  if (upcoming.length === 0) add(`(none scheduled right now)`);
  for (const e of upcoming) {
    if (!e.date) {
      add(`- ${e.title}: ${e.description} | ${t.events.mode[e.mode]} | date to be announced (coming soon) | no time, venue or registration yet: never invent them, suggest emailing ${profile.email} for details`);
      continue;
    }
    const when = [eventDates(e, locale), e.time && `${e.time} CET`].filter(Boolean).join(" ");
    const where = [t.events.mode[e.mode], e.location].filter(Boolean).join(" · ");
    const role = eventCategories[e.category].badge[locale];
    const action = eventAction(e);
    const button =
      action?.kind === "notes"
        ? `my notes from the event: ${action.url.startsWith("/") ? localePath(locale, action.url) : action.url}`
        : action?.kind === "website"
          ? `official event website: ${action.url} (not run by me; registration and tickets are on that site)`
          : action?.kind === "register"
            ? `${e.seats ? t.events.seatsLeft(e.seats) : t.events.openToAll} | register: ${link(e.url ?? "", `the ${t.events.register} button in the ${t.nav.sections.events} section`)}`
            : `no link yet: never invent one, suggest checking the ${t.nav.sections.events} section later`;
    add(`- ${e.title} | role: ${role} | ${when} | ${where} | ${e.description}${e.note ? ` ${e.note}` : ""} | ${button}`);
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
  add(`Documents by ${profile.firstName}, free to read on the site and to download as Markdown (.md) files, in the ${t.nav.sections.resources} section. Each is written in one language and shown as is on both language versions of the site.`);
  for (const r of resources) add(`- "${r.title}" (${r.category}, written in ${localeInfo[r.lang].name}, updated ${formatDate(r.updated, locale)}) ${resourceUrl(r.slug)} | ${r.description}`);
  add(`</free_resources>`);
  add();
  add(`<services>`);
  add(`Services ${profile.firstName} offers, shown as cards in the ${t.nav.sections.projects} section. To order one or ask about it, visitors use the ${t.nav.sections.contact} section or email ${profile.email}.`);
  for (const p of projects) add(`- ${p.title}: ${p.description} [${p.tags.join(", ")}]`);
  add(`</services>`);
  add();
  add(`<blog_posts>`);
  for (const p of posts) add(`- "${p.title}" (${formatDate(p.date, locale)}, ${p.readingTime} min) ${postUrl(p.slug)}${p.excerpt ? ` | ${p.excerpt}` : ""}`);
  add(`</blog_posts>`);
  add();
  add(`<ai_news_articles>`);
  add(`Short write-ups by ${profile.firstName} on recent AI news, newest first, in the ${t.nav.sections.news} section.`);
  for (const n of news) add(`- "${n.title}" (${formatDate(n.date, locale)}, ${n.readingTime} min) ${newsUrl(n.slug)}${n.excerpt ? ` | ${n.excerpt}` : ""}`);
  add(`</ai_news_articles>`);
  return lines.join("\n");
}
