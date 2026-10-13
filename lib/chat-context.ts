import "server-only";
import { profile } from "@/content/profile";
import { courses } from "@/content/courses";
import { events } from "@/content/events";
import { interviews } from "@/content/interviews";
import { resources } from "@/content/resources";
import { projects } from "@/content/projects";
import { socials } from "@/content/socials";
import { getAllPosts } from "./blog";
import { upcomingEvents } from "./events";
import { SITE_URL, SKOOL_URL, fullName } from "./config";
import { formatDate } from "./format";

/** Placeholder links ("#") in the content files are replaced with a hint. */
const link = (url: string, fallback: string) => (url && url !== "#" ? url : fallback);

/** Everything the assistant (AI or mock) may say comes from /content, so answers stay current. */
export async function getChatKnowledge() {
  return {
    upcoming: await upcomingEvents(events),
    posts: getAllPosts(),
  };
}

/**
 * System prompt for the Claude-powered assistant, built from the content files.
 * Kept byte-stable between requests (no timestamps) so prompt caching hits.
 */
export async function buildSystemPrompt(): Promise<string> {
  const { upcoming, posts } = await getChatKnowledge();
  const lines: string[] = [];
  const add = (s = "") => lines.push(s);

  add(`You are the friendly website assistant for ${fullName}, ${profile.role}, on their personal site (${SITE_URL}).`);
  add(`Visitors are potential students, workshop clients, journalists and fellow builders. Help them find courses, events, resources, interviews and ways to get in touch.`);
  add();
  add(`How to answer:`);
  add(`- Keep replies short: 1–4 sentences or a compact list. Plain text only — no markdown headings, tables or bold. Bare URLs are fine; the chat widget makes them clickable.`);
  add(`- Answer only from the facts below. If something isn't covered (e.g. personal details, availability on a specific date, discounts), say you don't know and suggest emailing ${profile.email}.`);
  add(`- Never invent courses, prices, dates, outlets or links.`);
  add(`- Speak about ${profile.firstName} in the third person. Match the visitor's language if they write in another language.`);
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
  add(`Socials: ${socials.map((s) => `${s.name} ${s.url}`).join("; ")}`);
  add(`Newsletter: "${profile.newsletter.title}" — ${profile.newsletter.text} Sign up in the Contact section of the site.`);
  add(`</profile>`);
  add();
  add(`<courses>`);
  for (const c of courses) {
    add(`- ${c.title} | ${c.tier === "free" ? "Free" : `Premium, €${c.price}`} | ${c.level} | ${c.duration} | ${c.description} | ${c.url ?? SKOOL_URL}`);
  }
  add(`</courses>`);
  add();
  add(`<upcoming_events timezone="CET">`);
  if (upcoming.length === 0) add(`(none scheduled right now)`);
  for (const e of upcoming) {
    add(`- ${e.title} | ${formatDate(e.date)} ${e.time} CET | ${e.mode} · ${e.location} | ${e.seats ? `${e.seats} seats left` : "open to all"} | ${e.description} | register: ${link(e.url, "the Register button in the Events section")}`);
  }
  add(`</upcoming_events>`);
  add();
  add(`<interviews_and_press>`);
  for (const i of interviews) add(`- "${i.title}" — ${i.outlet} (${i.format}, ${i.duration}, ${formatDate(i.date)}) ${link(i.url, "")}`);
  add(`</interviews_and_press>`);
  add();
  add(`<free_resources>`);
  for (const r of resources) add(`- ${r.title} | ${r.type} · ${r.category} · ${r.size} | ${r.description}`);
  add(`Visitors can search and open all resources in the Resources section of the site.`);
  add(`</free_resources>`);
  add();
  add(`<projects>`);
  for (const p of projects) add(`- ${p.title} (${p.year}): ${p.description} [${p.tags.join(", ")}]`);
  add(`</projects>`);
  add();
  add(`<blog_posts>`);
  for (const p of posts) add(`- "${p.title}" (${formatDate(p.date)}, ${p.readingTime} min) ${SITE_URL}/blog/${p.slug}`);
  add(`</blog_posts>`);
  return lines.join("\n");
}
