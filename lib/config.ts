import { profile } from "@/content/profile";

/** Public site URL, used for canonical links, sitemap and Open Graph. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Skool community link. Not used while courses are "coming soon": the nav and hero
 * buttons point to #contact instead (see "Switch the buttons back to Skool" in
 * docs/how-to-change.md). NEXT_PUBLIC_ so client components (navbar) can read it too.
 */
export const SKOOL_URL = process.env.NEXT_PUBLIC_SKOOL_URL || profile.skoolUrl;

/** Home-page sections linked in the navigation, in order. Labels: `nav.sections` in content/i18n. */
export const NAV = ["about", "projects", "blog", "interviews", "news", "courses", "resources", "events", "contact"] as const;

export const fullName = `${profile.firstName} ${profile.lastName}`;
