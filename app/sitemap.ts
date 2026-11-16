import type { MetadataRoute } from "next";
import type { ArticleCollection } from "@/lib/articles";
import { blog } from "@/lib/blog";
import { news } from "@/lib/news";
import { getResources } from "@/lib/resources";
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

/**
 * Every resource page, in the language the document is written in. The page in the other
 * language shows the same document and points to this one as canonical, so it is not listed.
 */
function resourceEntries(): MetadataRoute.Sitemap {
  return getResources().map((r) => {
    const path = `/resources/${r.slug}`;
    return {
      url: `${SITE_URL}${localePath(r.lang, path)}`,
      lastModified: r.updated,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: abs(languageAlternates(path, [r.lang])) },
    };
  });
}

/** Every page in every language it is translated into, with hreflang links between them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const articles = [...articleEntries(blog), ...articleEntries(news), ...resourceEntries()];
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
