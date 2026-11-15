import { postsOnHome } from "@/content/posts";
import { getAllPosts } from "@/lib/blog";
import { getI18n } from "@/lib/i18n/server";
import PostGrid from "../PostGrid";
import { SectionHead } from "../ui";

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
      <PostGrid items={posts} collection="blog" />
    </section>
  );
}
