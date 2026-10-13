import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import * as runtime from "react/jsx-runtime";
import { compile, runSync } from "@mdx-js/mdx";
import { cacheLife } from "next/cache";
import { getPost, getPostSlugs } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { SITE_URL, fullName } from "@/lib/config";
import { ArrowLeft } from "@/components/icons";
import { Cover } from "@/components/ui";

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  const { meta } = post;
  return {
    title: meta.title,
    description: meta.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: "article", title: meta.title, description: meta.excerpt, publishedTime: meta.date, authors: [fullName], url: `${SITE_URL}/blog/${slug}` },
  };
}

/** Compile MDX → JS once per source text (cached), so posts prerender as fully static HTML. */
async function compileMdx(source: string): Promise<string> {
  "use cache";
  cacheLife("max");
  return String(await compile(source, { outputFormat: "function-body" }));
}

async function Article({ params }: { params: PageProps<"/blog/[slug]">["params"] }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const { meta, source } = post;
  const { default: Content } = runSync(await compileMdx(source), { ...runtime, baseUrl: import.meta.url });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: meta.title,
    description: meta.excerpt,
    datePublished: meta.date,
    author: { "@type": "Person", name: fullName, url: SITE_URL },
    url: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <article className="article glass">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link href="/#blog" className="link-arrow">
        <ArrowLeft /> All posts
      </Link>
      <header style={{ marginTop: "1.6rem" }}>
        <p className="mono" style={{ color: "var(--muted)", display: "flex", gap: ".8rem" }}>
          <time dateTime={meta.date}>{formatDate(meta.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{meta.readingTime} min read</span>
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

export default function PostPage(props: PageProps<"/blog/[slug]">) {
  return (
    <main id="main" className="wrap section" style={{ paddingTop: "clamp(32px, 6vw, 64px)" }}>
      <Suspense fallback={<div className="article glass" style={{ minHeight: "60vh" }} aria-busy="true" />}>
        <Article params={props.params} />
      </Suspense>
    </main>
  );
}
