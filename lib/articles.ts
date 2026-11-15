import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { defaultLocale, locales, type Locale } from "./i18n";

/** A folder of MDX articles under /content: "blog" (lib/blog.ts) or "news" (lib/news.ts). */
export type Collection = "blog" | "news";

export type ArticleMeta = {
  slug: string;
  /** Language the article is written in. Differs from the page language when a translation is missing. */
  lang: Locale;
  title: string;
  date: string;
  readingTime: number;
  excerpt: string;
  cover?: string;
  glyph?: string;
  featured?: boolean;
};

// Synchronous reads on purpose: with Cache Components, sync I/O is included in the
// static prerender (so articles ship as static HTML), while `next dev` re-reads the
// files on every request, so MDX edits show up immediately.

function toMeta(slug: string, lang: Locale, data: Record<string, unknown>, body: string): ArticleMeta {
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

/**
 * Loader for one collection: content/<collection>/sr/<slug>.mdx, content/<collection>/en/<slug>.mdx.
 * Same slug in every language. With `featured`, the first `featured: true` article is moved to
 * the front and gets the double-width card (blog); without it, the list is strictly newest first.
 */
export function createCollection(collection: Collection, { featured = false }: { featured?: boolean } = {}) {
  const dir = path.join(process.cwd(), "content", collection);
  const file = (lang: Locale, slug: string) => path.join(dir, lang, `${slug}.mdx`);

  /** Every slug that exists in at least one language. */
  function getSlugs(): string[] {
    const slugs = new Set<string>();
    for (const lang of locales) {
      const langDir = path.join(dir, lang);
      if (!fs.existsSync(langDir)) continue;
      for (const f of fs.readdirSync(langDir)) if (f.endsWith(".mdx")) slugs.add(f.replace(/\.mdx$/, ""));
    }
    return [...slugs];
  }

  function hasTranslation(slug: string, locale: Locale): boolean {
    return fs.existsSync(file(locale, slug));
  }

  /** The language an article is read in: the requested one if translated, otherwise the default, otherwise any. */
  function sourceLang(slug: string, locale: Locale): Locale | null {
    for (const lang of [locale, defaultLocale, ...locales]) if (hasTranslation(slug, lang)) return lang;
    return null;
  }

  /** All articles in a language, newest first. */
  function getAll(locale: Locale): ArticleMeta[] {
    const items = getSlugs().map((slug) => {
      const lang = sourceLang(slug, locale)!;
      const { data, content } = matter(fs.readFileSync(file(lang, slug), "utf8"));
      return toMeta(slug, lang, data, content);
    });
    items.sort((a, b) => b.date.localeCompare(a.date));
    if (!featured) return items.map((p) => ({ ...p, featured: false }));
    const first = items.findIndex((p) => p.featured);
    if (first > 0) items.unshift(...items.splice(first, 1));
    return items.map((p, i) => ({ ...p, featured: i === 0 }));
  }

  function get(slug: string, locale: Locale): { meta: ArticleMeta; source: string } | null {
    if (!/^[a-z0-9-]+$/i.test(slug)) return null;
    const lang = sourceLang(slug, locale);
    if (!lang) return null;
    const { data, content } = matter(fs.readFileSync(file(lang, slug), "utf8"));
    return { meta: toMeta(slug, lang, data, content), source: content };
  }

  return { collection, getSlugs, hasTranslation, getAll, get };
}

export type ArticleCollection = ReturnType<typeof createCollection>;
