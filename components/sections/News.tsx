import { newsOnHome } from "@/content/posts";
import { news } from "@/lib/news";
import { getI18n } from "@/lib/i18n/server";
import PostGrid from "../PostGrid";
import { SectionHead } from "../ui";

/** AI news articles from content/news/<lang>/, newest first. */
export default async function News() {
  const { locale, t } = await getI18n();
  const items = news.getAll(locale).slice(0, newsOnHome);
  return (
    <section id="news" className="section wrap" aria-labelledby="news-title">
      <SectionHead
        id="news-title"
        eyebrow={t.news.eyebrow}
        title={t.news.title}
        accent={t.news.accent}
        lede={t.news.lede}
      />
      <PostGrid items={items} collection="news" />
    </section>
  );
}
