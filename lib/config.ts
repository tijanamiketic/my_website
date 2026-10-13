import { profile } from "@/content/profile";

/** Public site URL, used for canonical links, sitemap and Open Graph. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");

/**
 * Skool community link used by every course / CTA button. NEXT_PUBLIC_ so the
 * same value is available to client components (navbar) and the server.
 */
export const SKOOL_URL = process.env.NEXT_PUBLIC_SKOOL_URL || profile.skoolUrl;

/** Home-page sections linked in the navigation, in order. Labels: `nav.sections` in content/i18n. */
export const NAV = ["about", "projects", "blog", "interviews", "news", "courses", "resources", "events", "contact"] as const;

export const fullName = `${profile.firstName} ${profile.lastName}`;
