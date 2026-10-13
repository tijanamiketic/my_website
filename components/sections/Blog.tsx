import Link from "next/link";
import { postsOnHome } from "@/content/posts";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { localeInfo, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight } from "../icons";
import { Cover, SectionHead } from "../ui";

export default async function Blog() {
  const { locale, t } = await getI18n();
  const posts = getAllPosts(locale).slice(0, postsOnHome);
  return (
    <section id="blog" className="section wrap" aria-labelledby="blog-title">
      <SectionHead
        id="blog-title"
        eyebrow={t.blog.eyebrow}
        title={t.blog.title}
        accent={t.blog.accent}
        lede={t.blog.lede}
      />
      <div className="blog-grid">
        {posts.map((p, i) => (
          <article
            key={p.slug}
            className={`post glass${p.featured ? " featured" : ""}`}
            data-reveal
            data-tilt
            data-stagger={i % 3}
            // Untranslated post shown in its original language
            lang={p.lang === locale ? undefined : localeInfo[p.lang].htmlLang}
            style={{ "--dir": i % 2 ? 1 : -1 } as React.CSSProperties}
          >
            <Cover
              title={p.title}
              image={p.cover}
              glyph={p.glyph}
              sizes={p.featured ? "(max-width: 640px) 100vw, 600px" : "(max-width: 640px) 100vw, 400px"}
            />
            <div className="body">
              <div className="meta mono">
                <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
                <span aria-hidden="true">·</span>
                <span>{t.blog.minRead(p.readingTime)}</span>
                {p.lang !== locale && <span className="chip">{localeInfo[p.lang].short}</span>}
              </div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <Link className="link-arrow stretched" href={localePath(locale, `/blog/${p.slug}`)} lang={localeInfo[locale].htmlLang}>
                {t.blog.readMore}<span className="sr-only">: {p.title}</span> <ArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
