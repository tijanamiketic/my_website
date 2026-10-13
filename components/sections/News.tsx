import { getNews } from "@/lib/news";
import { SectionHead } from "../ui";
import NewsFeed from "./NewsFeed";

export default async function News() {
  const feed = await getNews();
  return (
    <section id="news" className="section wrap" aria-labelledby="news-title">
      <SectionHead
        id="news-title"
        eyebrow="AI News"
        title="This week in"
        accent="AI"
        lede="A curated feed of what's moving across research, policy and industry worldwide."
      />
      <NewsFeed items={feed.items} live={feed.live} fetchedAt={feed.fetchedAt} />
    </section>
  );
}
