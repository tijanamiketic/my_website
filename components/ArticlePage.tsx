import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, runSync } from "@mdx-js/mdx";
import { cacheLife } from "next/cache";
import { dictionaries } from "@/content/i18n";
import type { Dictionary } from "@/content/i18n/sr";
import type { ArticleCollection, Collection } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { SITE_URL, fullName } from "@/lib/config";
import { languageAlternates, localeInfo, localePath, locales } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowLeft } from "./icons";
import { Cover } from "./ui";

/**
 * Shared article page for MDX collections (blog posts, AI news). Used by
 * app/[lang]/blog/[slug]/page.tsx and app/[lang]/news/[slug]/page.tsx.
 */

/** Interface text that differs per collection. */
function labelsFor(collection: Collection, t: Dictionary) {
  return collection === "blog"
    ? { back: t.blog.allPosts, notTranslated: t.blog.notTranslated, notFoundTitle: t.blog.notFoundTitle }
    : { back: t.news.allNews, notTranslated: t.news.notTranslated, notFoundTitle: t.news.notFoundTitle };
}

const schemaType: Record<Collection, string> = { blog: "BlogPosting", news: "NewsArticle" };

export async function articleMetadata(items: ArticleCollection, params: Promise<{ slug: string }>): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const item = items.get(slug, locale);
  if (!item) return { title: labelsFor(items.collection, t).notFoundTitle };
  const { meta } = item;
  const path = `/${items.collection}/${slug}`;
  // An untranslated article shown as a fallback points search engines to the original.
  const canonical = localePath(meta.lang, path);
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical, languages: languageAlternates(path, locales.filter((l) => items.hasTranslation(slug, l))) },
    openGraph: { type: "article", title: meta.title, description: meta.excerpt, publishedTime: meta.date, authors: [fullName], url: `${SITE_URL}${canonical}`, locale: localeInfo[meta.lang].og },
  };
}

/** Compile MDX → JS once per source text (cached), so articles prerender as fully static HTML. */
async function compileMdx(source: string): Promise<string> {
  "use cache";
  cacheLife("max");
  return String(await compile(source, { outputFormat: "function-body" }));
}

async function ArticleView({ items, params }: { items: ArticleCollection; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const labels = labelsFor(items.collection, t);
  const item = items.get(slug, locale);
  if (!item) notFound();
  const { meta, source } = item;
  const { default: Content } = runSync(await compileMdx(source), { ...runtime, baseUrl: import.meta.url });
  const translated = meta.lang === locale;
  const path = `/${items.collection}/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": schemaType[items.collection],
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    inLanguage: localeInfo[meta.lang].htmlLang,
    author: { "@type": "Person", name: fullName, url: SITE_URL },
    url: `${SITE_URL}${localePath(meta.lang, path)}`,
  };

  return (
    <article className="article glass" lang={translated ? undefined : localeInfo[meta.lang].htmlLang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href={`${localePath(locale, "/")}#${items.collection}`} className="link-arrow" lang={localeInfo[locale].htmlLang}>
        <ArrowLeft /> {labels.back}
      </Link>
      {!translated && (
        <p className="notice" lang={localeInfo[locale].htmlLang}>
          {labels.notTranslated}
        </p>
      )}
      <header style={{ marginTop: "1.6rem" }}>
        <p className="mono" style={{ color: "var(--muted)", display: "flex", gap: ".8rem" }}>
          <time dateTime={meta.date}>{formatDate(meta.date, meta.lang)}</time>
          <span aria-hidden="true">·</span>
          <span>{dictionaries[meta.lang].blog.minRead(meta.readingTime)}</span>
        </p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 750, letterSpacing: "-.04em", marginTop: ".6rem" }}>{meta.title}</h1>
      </header>
      <Cover title={meta.title} image={meta.cover} glyph={meta.glyph} className="article-cover" sizes="(max-width: 800px) 100vw, 700px" />
      <div className="prose">
        <Content />
      </div>
    </article>
  );
}

/** The whole page. Params are read inside Suspense, so the shell prerenders while the article streams in. */
export function ArticlePage({ items, params }: { items: ArticleCollection; params: Promise<{ slug: string }> }) {
  return (
    <main id="main" className="wrap section" style={{ paddingTop: "clamp(32px, 6vw, 64px)" }}>
      <Suspense fallback={<div className="article glass" style={{ minHeight: "60vh" }} aria-busy="true" />}>
        <ArticleView items={items} params={params} />
      </Suspense>
    </main>
  );
}
