import Link from "next/link";
import { postsOnHome } from "@/content/posts";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/format";
import { ArrowRight } from "../icons";
import { Cover, SectionHead } from "../ui";

export default function Blog() {
  const posts = getAllPosts().slice(0, postsOnHome);
  return (
    <section id="blog" className="section wrap" aria-labelledby="blog-title">
      <SectionHead
        id="blog-title"
        eyebrow="Blog"
        title="Notes from the"
        accent="lab"
        lede="Long-form writing on building with language models, teaching AI, and what actually works in production."
      />
      <div className="blog-grid">
        {posts.map((p, i) => (
          <article
            key={p.slug}
            className={`post glass${p.featured ? " featured" : ""}`}
            data-reveal
            data-tilt
            data-stagger={i % 3}
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
                <time dateTime={p.date}>{formatDate(p.date)}</time>
                <span aria-hidden="true">·</span>
                <span>{p.readingTime} min read</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.excerpt}</p>
              <Link className="link-arrow stretched" href={`/blog/${p.slug}`}>
                Read more<span className="sr-only">: {p.title}</span> <ArrowRight />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
