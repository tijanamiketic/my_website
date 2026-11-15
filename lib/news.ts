import "server-only";
import { createCollection } from "./articles";

/**
 * AI news articles: content/news/sr/<slug>.mdx, content/news/en/<slug>.mdx. Same slug in every
 * language, same frontmatter as blog posts. Always newest first; no featured card.
 * `news.getAll(locale)` is everything a future full listing page needs.
 */
export const news = createCollection("news");
