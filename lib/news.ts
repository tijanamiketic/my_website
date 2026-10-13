import "server-only";
import { cacheLife } from "next/cache";
import { XMLParser } from "fast-xml-parser";
import { aiKeywords, mockNews, newsLimit, newsSources, topicRules } from "@/content/news-sources";
import type { NewsItem, NewsSource } from "@/content/types";

export type NewsFeed = {
  items: NewsItem[];
  /** false when every feed failed and mock data is shown. */
  live: boolean;
  fetchedAt: string;
};

const FETCH_TIMEOUT_MS = 8000;
const MAX_PER_SOURCE = 4; // keep the mix diverse
const MAX_AGE_DAYS = 21;

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  textNodeName: "#text",
  processEntities: true,
  htmlEntities: true,
});

type Raw = Record<string, unknown>;
const asArray = <T,>(v: T | T[] | undefined): T[] => (v === undefined ? [] : Array.isArray(v) ? v : [v]);

function text(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string" || typeof v === "number") return String(v);
  if (typeof v === "object" && "#text" in (v as Raw)) return String((v as Raw)["#text"]);
  return "";
}

function clean(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function atomLink(link: unknown): string {
  for (const l of asArray(link as Raw | Raw[])) {
    if (typeof l === "string") return l;
    const rel = l["@rel"];
    if (!rel || rel === "alternate") return String(l["@href"] ?? "");
  }
  return "";
}

function classify(title: string, fallback: NewsItem["topic"]): NewsItem["topic"] {
  return topicRules.find((r) => r.pattern.test(title))?.topic ?? fallback;
}

/** Normalise one RSS 2.0 / RSS 1.0 / Atom document into NewsItems. */
export function parseFeed(xml: string, source: NewsSource): NewsItem[] {
  const doc = parser.parse(xml) as Raw;
  const rss = (doc.rss as Raw | undefined)?.channel as Raw | undefined;
  const rdf = doc["rdf:RDF"] as Raw | undefined;
  const atom = doc.feed as Raw | undefined;
  const entries: Raw[] = rss ? asArray(rss.item as Raw[]) : rdf ? asArray(rdf.item as Raw[]) : atom ? asArray(atom.entry as Raw[]) : [];

  return entries
    .map((e): NewsItem | null => {
      const title = clean(text(e.title));
      const url = clean(atom ? atomLink(e.link) : text(e.link) || text(e.guid));
      const rawDate = text(e.pubDate) || text(e["dc:date"]) || text(e.published) || text(e.updated);
      const date = new Date(rawDate);
      if (!title || !/^https?:\/\//.test(url) || Number.isNaN(date.getTime())) return null;
      return { source: source.name, region: source.region, topic: classify(title, source.topic), date: date.toISOString(), title, url };
    })
    .filter((x): x is NewsItem => x !== null && (!source.aiOnly || aiKeywords.test(x.title)))
    .slice(0, MAX_PER_SOURCE);
}

async function fetchSource(source: NewsSource): Promise<NewsItem[]> {
  const res = await fetch(source.url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { "user-agent": "Mozilla/5.0 (portfolio news reader)", accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" },
  });
  if (!res.ok) throw new Error(`${source.name}: HTTP ${res.status}`);
  return parseFeed(await res.text(), source);
}

const normTitle = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const normUrl = (u: string) => u.replace(/[?#].*$/, "").replace(/\/$/, "").toLowerCase();

export function mergeNews(lists: NewsItem[][], now: number, limit = newsLimit): NewsItem[] {
  const seen = new Set<string>();
  const out: NewsItem[] = [];
  const minDate = now - MAX_AGE_DAYS * 864e5;
  for (const item of lists.flat().sort((a, b) => b.date.localeCompare(a.date))) {
    const t = new Date(item.date).getTime();
    if (t < minDate || t > now + 36e5) continue; // too old, or bogus future date
    const keys = [normUrl(item.url), normTitle(item.title)];
    if (keys.some((k) => seen.has(k))) continue;
    keys.forEach((k) => seen.add(k));
    out.push(item);
  }
  return out.slice(0, limit);
}

/**
 * Latest AI news from the feeds in content/news-sources.ts.
 * Cached for an hour (ISR-style: served from cache, refreshed in the background).
 */
export async function getNews(): Promise<NewsFeed> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });

  const now = Date.now();
  const results = await Promise.allSettled(newsSources.map(fetchSource));
  const ok = results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []));
  for (const r of results) if (r.status === "rejected") console.warn("[news] feed failed:", String(r.reason));

  const items = mergeNews(ok, now);
  if (items.length >= 4) return { items, live: true, fetchedAt: new Date(now).toISOString() };
  return { items: mockNews, live: false, fetchedAt: new Date(now).toISOString() };
}
