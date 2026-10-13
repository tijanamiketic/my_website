/**
 * Blog posts live as MDX files in /content/blog/<slug>.mdx with frontmatter:
 *
 * ---
 * title: "Post title"
 * date: "2026-09-18"
 * readingTime: 12
 * excerpt: "One or two sentences shown on the card."
 * cover: "/blog/my-cover.webp"   # optional — omit for a generated gradient cover
 * glyph: "▲"                      # optional — symbol on the generated cover
 * featured: true                  # optional — first featured post gets the double-width card
 * ---
 *
 * This file only controls how many posts show on the home page.
 */
export const postsOnHome = 5;
