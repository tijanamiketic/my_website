import Link from "next/link";
import type { ArticleMeta, Collection } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import { localeInfo, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight } from "./icons";
import { Cover } from "./ui";

/** Card grid for MDX articles (Blog and AI News sections). Each card links to /<collection>/<slug>. */
export default async function PostGrid({ items, collection }: { items: ArticleMeta[]; collection: Collection }) {
  const { locale, t } = await getI18n();
  return (
    <div className="blog-grid">
      {items.map((p, i) => (
        <article
          key={p.slug}
          className={`post glass${p.featured ? " featured" : ""}`}
          data-reveal
          data-tilt
          data-stagger={i % 3}
          // Untranslated article shown in its original language
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
            <Link className="link-arrow stretched" href={localePath(locale, `/${collection}/${p.slug}`)} lang={localeInfo[locale].htmlLang}>
              {t.blog.readMore}<span className="sr-only">: {p.title}</span> <ArrowRight />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
