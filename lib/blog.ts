import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, locales, type Locale } from "./i18n";

export type PostMeta = {
  slug: string;
  /** Language the post is written in. Differs from the page language when a translation is missing. */
  lang: Locale;
  title: string;
  date: string;
  readingTime: number;
  excerpt: string;
  cover?: string;
  glyph?: string;
  featured?: boolean;
};

/** One folder per language: content/blog/sr/<slug>.mdx, content/blog/en/<slug>.mdx. Same slug in every language. */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const file = (lang: Locale, slug: string) => path.join(BLOG_DIR, lang, `${slug}.mdx`);

// Synchronous reads on purpose: with Cache Components, sync I/O is included in the
// static prerender (so the blog ships as static HTML), while `next dev` re-reads the
// files on every request, so MDX edits show up immediately.

function toMeta(slug: string, lang: Locale, data: Record<string, unknown>, body: string): PostMeta {
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
    lang,
    title: String(data.title ?? slug),
    // gray-matter turns unquoted YAML dates into Date objects
    date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? ""),
    readingTime: Number(data.readingTime) || Math.max(1, Math.round(words / 220)),
    excerpt: String(data.excerpt ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    glyph: data.glyph ? String(data.glyph) : undefined,
    featured: Boolean(data.featured),
  };
}

/** Every slug that exists in at least one language. */
export function getPostSlugs(): string[] {
  const slugs = new Set<string>();
  for (const lang of locales) {
    const dir = path.join(BLOG_DIR, lang);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) if (f.endsWith(".mdx")) slugs.add(f.replace(/\.mdx$/, ""));
  }
  return [...slugs];
}

export function hasTranslation(slug: string, locale: Locale): boolean {
  return fs.existsSync(file(locale, slug));
}

/** The language a post is read in: the requested one if translated, otherwise the default, otherwise any. */
function sourceLang(slug: string, locale: Locale): Locale | null {
  for (const lang of [locale, defaultLocale, ...locales]) if (hasTranslation(slug, lang)) return lang;
  return null;
}

/** All posts in a language, newest first. The first `featured` post is moved to the front. */
export function getAllPosts(locale: Locale): PostMeta[] {
  const posts = getPostSlugs().map((slug) => {
    const lang = sourceLang(slug, locale)!;
    const { data, content } = matter(fs.readFileSync(file(lang, slug), "utf8"));
    return toMeta(slug, lang, data, content);
  });
  posts.sort((a, b) => b.date.localeCompare(a.date));
  const featured = posts.findIndex((p) => p.featured);
  if (featured > 0) posts.unshift(...posts.splice(featured, 1));
  return posts.map((p, i) => ({ ...p, featured: i === 0 }));
}

export function getPost(slug: string, locale: Locale): { meta: PostMeta; source: string } | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const lang = sourceLang(slug, locale);
  if (!lang) return null;
  const { data, content } = matter(fs.readFileSync(file(lang, slug), "utf8"));
  return { meta: toMeta(slug, lang, data, content), source: content };
}
