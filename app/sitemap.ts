import type { MetadataRoute } from "next";
import type { ArticleCollection } from "@/lib/articles";
import { blog } from "@/lib/blog";
import { news } from "@/lib/news";
import { SITE_URL } from "@/lib/config";
import { defaultLocale, languageAlternates, localePath, locales } from "@/lib/i18n";

const abs = (links: Record<string, string>) => Object.fromEntries(Object.entries(links).map(([k, v]) => [k, `${SITE_URL}${v}`]));

/** Every article in a collection, in every language it is translated into. */
function articleEntries(items: ArticleCollection): MetadataRoute.Sitemap {
  return items.getAll(defaultLocale).flatMap((p) => {
    const path = `/${items.collection}/${p.slug}`;
    const available = locales.filter((l) => items.hasTranslation(p.slug, l));
    return available.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: abs(languageAlternates(path, available)) },
    }));
  });
}

/** Every page in every language it is translated into, with hreflang links between them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = [...articleEntries(blog), ...articleEntries(news)];
  const latest = articles.map((a) => String(a.lastModified)).sort().at(-1);
  const home = locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, "/")}`,
    changeFrequency: "weekly" as const,
    priority: 1,
    lastModified: latest,
    alternates: { languages: abs(languageAlternates("/")) },
  }));
  return [...home, ...articles];
}
