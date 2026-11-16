import type { Metadata } from "next";
import { ResourcePage, resourceMetadata } from "@/components/ResourcePage";
import { resources } from "@/content/resources";

export function generateStaticParams() {
  return resources.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: PageProps<"/[lang]/resources/[slug]">): Promise<Metadata> {
  return resourceMetadata(params);
}

export default function ResourceDetailPage({ params }: PageProps<"/[lang]/resources/[slug]">) {
  return <ResourcePage params={params} />;
}
