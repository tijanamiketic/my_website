import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense, type ComponentProps } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, runSync } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { cacheLife } from "next/cache";
import { resourceCategories } from "@/content/resources";
import { formatDate } from "@/lib/format";
import { SITE_URL, fullName } from "@/lib/config";
import { languageAlternates, localeInfo, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getResource } from "@/lib/resources";
import { ArrowLeft, Download } from "./icons";

/**
 * Page for one resource (app/[lang]/resources/[slug]/page.tsx). Same layout and styles as the
 * article page (components/ArticlePage.tsx), with a download button instead of a cover.
 * The Markdown is rendered as plain Markdown + GitHub tables (not MDX), so a note's text is never run as code.
 */

type Params = Promise<{ slug: string }>;

export async function resourceMetadata(params: Params): Promise<Metadata> {
  const { slug } = await params;
  const { t } = await getI18n();
  const doc = getResource(slug);
  if (!doc) return { title: t.resources.notFoundTitle };
  const path = `/resources/${slug}`;
  // The document exists in one language; the other language version points search engines to it.
  const canonical = localePath(doc.lang, path);
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical, languages: languageAlternates(path, [doc.lang]) },
    openGraph: { type: "article", title: doc.title, description: doc.description, modifiedTime: doc.updated, authors: [fullName], url: `${SITE_URL}${canonical}`, locale: localeInfo[doc.lang].og },
  };
}

/** Compile Markdown → JS once per source text (cached), so the page prerenders as static HTML. */
async function compileMarkdown(source: string): Promise<string> {
  "use cache";
  cacheLife("max");
  return String(await compile(source, { format: "md", remarkPlugins: [remarkGfm], outputFormat: "function-body" }));
}

/** Wide tables scroll sideways on small screens instead of widening the page. */
const components = {
  table: (props: ComponentProps<"table">) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
};

async function ResourceView({ params }: { params: Params }) {
  const { slug } = await params;
  const { locale, t } = await getI18n();
  const doc = getResource(slug);
  if (!doc) notFound();
  const { default: Content } = runSync(await compileMarkdown(doc.body), { ...runtime, baseUrl: import.meta.url });
  const docLang = doc.lang === locale ? undefined : localeInfo[doc.lang].htmlLang;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    dateModified: doc.updated,
    inLanguage: localeInfo[doc.lang].htmlLang,
    author: { "@type": "Person", name: fullName, url: SITE_URL },
    url: `${SITE_URL}${localePath(doc.lang, `/resources/${slug}`)}`,
  };

  const download = (
    <a className="btn btn-primary" href={doc.file} download={`${doc.slug}.md`} aria-label={t.resources.downloadAria(doc.title)}>
      <Download width={16} height={16} /> {t.resources.download}
    </a>
  );

  return (
    <article className="article glass">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href={`${localePath(locale, "/")}#resources`} className="link-arrow">
        <ArrowLeft /> {t.resources.allResources}
      </Link>
      {docLang && <p className="notice">{t.resources.notTranslated}</p>}
      <header style={{ marginTop: "1.6rem" }}>
        <p className="mono" style={{ color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: ".8rem" }}>
          <span>{resourceCategories[doc.category][locale]}</span>
          <span aria-hidden="true">·</span>
          <span>
            {t.resources.updated} <time dateTime={doc.updated}>{formatDate(doc.updated, locale)}</time>
          </span>
        </p>
        <h1 lang={docLang} style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: 750, letterSpacing: "-.04em", marginTop: ".6rem" }}>
          {doc.title}
        </h1>
        <div style={{ marginTop: "1.4rem" }}>{download}</div>
      </header>
      <div className="prose doc-prose" lang={docLang} style={{ marginTop: "2.2rem" }}>
        <Content components={components} />
      </div>
      <hr className="resource-end" />
      {download}
    </article>
  );
}

/** The whole page. Params are read inside Suspense, so the shell prerenders while the document streams in. */
export function ResourcePage({ params }: { params: Params }) {
  return (
    <main id="main" className="wrap section" style={{ paddingTop: "clamp(32px, 6vw, 64px)" }}>
      <Suspense fallback={<div className="article glass" style={{ minHeight: "60vh" }} aria-busy="true" />}>
        <ResourceView params={params} />
      </Suspense>
    </main>
  );
}
