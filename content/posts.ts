/**
 * Blog posts live as MDX files, one folder per language, with the same file name
 * (slug) in each: /content/blog/sr/<slug>.mdx and /content/blog/en/<slug>.mdx.
 * A post missing in one language is shown in the other, with a notice. Frontmatter:
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
