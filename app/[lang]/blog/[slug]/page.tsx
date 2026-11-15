import type { Metadata } from "next";
import { ArticlePage, articleMetadata } from "@/components/ArticlePage";
import { blog } from "@/lib/blog";

export function generateStaticParams() {
  return blog.getSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  return articleMetadata(blog, params);
}

export default function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  return <ArticlePage items={blog} params={params} />;
}
