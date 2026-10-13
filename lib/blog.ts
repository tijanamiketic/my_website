import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  readingTime: number;
  excerpt: string;
  cover?: string;
  glyph?: string;
  featured?: boolean;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

// Synchronous reads on purpose: with Cache Components, sync I/O is included in the
// static prerender (so the blog ships as static HTML), while `next dev` re-reads the
// files on every request, so MDX edits show up immediately.

function toMeta(slug: string, data: Record<string, unknown>, body: string): PostMeta {
  const words = body.split(/\s+/).filter(Boolean).length;
  return {
    slug,
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

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

/** All posts, newest first. The first `featured` post is moved to the front. */
export function getAllPosts(): PostMeta[] {
  const posts = getPostSlugs().map((slug) => {
    const { data, content } = matter(fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8"));
    return toMeta(slug, data, content);
  });
  posts.sort((a, b) => b.date.localeCompare(a.date));
  const featured = posts.findIndex((p) => p.featured);
  if (featured > 0) posts.unshift(...posts.splice(featured, 1));
  return posts.map((p, i) => ({ ...p, featured: i === 0 }));
}

export function getPost(slug: string): { meta: PostMeta; source: string } | null {
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: toMeta(slug, data, content), source: content };
}
