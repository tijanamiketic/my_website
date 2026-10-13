import type { MetadataRoute } from "next";
import { getAllPosts, hasTranslation } from "@/lib/blog";
import { SITE_URL } from "@/lib/config";
import { defaultLocale, languageAlternates, localePath, locales } from "@/lib/i18n";

const abs = (links: Record<string, string>) => Object.fromEntries(Object.entries(links).map(([k, v]) => [k, `${SITE_URL}${v}`]));

/** Every page in every language it is translated into, with hreflang links between them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts(defaultLocale);
  const home = locales.map((locale) => ({
    url: `${SITE_URL}${localePath(locale, "/")}`,
    changeFrequency: "weekly" as const,
    priority: 1,
    lastModified: posts[0]?.date,
    alternates: { languages: abs(languageAlternates("/")) },
  }));
  const articles = posts.flatMap((p) => {
    const path = `/blog/${p.slug}`;
    const available = locales.filter((l) => hasTranslation(p.slug, l));
    return available.map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: p.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: abs(languageAlternates(path, available)) },
    }));
  });
  return [...home, ...articles];
}
