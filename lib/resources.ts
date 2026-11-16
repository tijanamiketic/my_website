import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { resources, type ResourceCategory } from "@/content/resources";
import type { Locale } from "./i18n";
import { obsidianToMarkdown } from "./obsidian";

/** A resource from content/resources.ts with its title and description read from the Markdown file. */
export type ResourceDoc = {
  slug: string;
  category: ResourceCategory;
  lang: Locale;
  updated: string;
  title: string;
  description: string;
  /** Public URL of the original file, e.g. "/resources/documentation-standard.md". */
  file: string;
};

const dir = path.join(process.cwd(), "public", "resources");

// Synchronous reads on purpose, as in lib/articles.ts: they are included in the static prerender.
function load(entry: (typeof resources)[number]): { doc: ResourceDoc; body: string } {
  const { data, content } = matter(fs.readFileSync(path.join(dir, `${entry.slug}.md`), "utf8"));
  let body = obsidianToMarkdown(content);

  // The first "# " heading becomes the page title, so it is taken out of the body (no duplicate heading).
  let title = typeof data.title === "string" ? data.title : "";
  const h1 = body.match(/^# +(.+?)[ #]*$/m);
  if (!title && h1) {
    title = h1[1];
    body = body.replace(h1[0], "");
  }

  // Card description: the first plain paragraph (not a heading, list, quote, table or code).
  let description = typeof data.description === "string" ? data.description : "";
  if (!description) {
    const para = body
      .trim()
      .split(/\n\s*\n/)
      .find((block) => !/^\s*([#>|`~*+-]|\d+\.)/.test(block));
    description = (para ?? "").replace(/\s*\n\s*/g, " ").replace(/\*\*|`/g, "").trim();
  }

  return { doc: { ...entry, title: title || entry.slug, description, file: `/resources/${entry.slug}.md` }, body: body.trim() };
}

/** Every resource, in the order of content/resources.ts. */
export function getResources(): ResourceDoc[] {
  return resources.map((entry) => load(entry).doc);
}

/** One resource with its Markdown body (Obsidian syntax converted), or null if the slug is unknown. */
export function getResource(slug: string): (ResourceDoc & { body: string }) | null {
  const entry = resources.find((r) => r.slug === slug);
  if (!entry) return null;
  const { doc, body } = load(entry);
  return { ...doc, body };
}
