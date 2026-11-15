import "server-only";
import { createCollection, type ArticleMeta } from "./articles";

/** Blog posts: content/blog/sr/<slug>.mdx, content/blog/en/<slug>.mdx. Same slug in every language. */
export const blog = createCollection("blog", { featured: true });

export type PostMeta = ArticleMeta;

export const getPostSlugs = blog.getSlugs;
export const hasTranslation = blog.hasTranslation;
/** All posts in a language, newest first. The first `featured` post is moved to the front. */
export const getAllPosts = blog.getAll;
export const getPost = blog.get;
