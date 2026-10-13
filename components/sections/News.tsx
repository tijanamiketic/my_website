import { getNews } from "@/lib/news";
import { getI18n } from "@/lib/i18n/server";
import { SectionHead } from "../ui";
import NewsFeed from "./NewsFeed";

export default async function News() {
  const feed = await getNews();
  const { t } = await getI18n();
  return (
    <section id="news" className="section wrap" aria-labelledby="news-title">
      <SectionHead
        id="news-title"
        eyebrow={t.news.eyebrow}
        title={t.news.title}
        accent={t.news.accent}
        lede={t.news.lede}
      />
      <NewsFeed items={feed.items} live={feed.live} fetchedAt={feed.fetchedAt} />
    </section>
  );
}
