import type { Metadata } from "next";
import { ArticlePage, articleMetadata } from "@/components/ArticlePage";
import { news } from "@/lib/news";

export function generateStaticParams() {
  return news.getSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps<"/[lang]/news/[slug]">): Promise<Metadata> {
  return articleMetadata(news, params);
}

export default function NewsArticlePage({ params }: PageProps<"/[lang]/news/[slug]">) {
  return <ArticlePage items={news} params={params} />;
}
