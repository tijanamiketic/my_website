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

export const NAV = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "blog", label: "Blog" },
  { id: "interviews", label: "Interviews" },
  { id: "news", label: "AI News" },
  { id: "courses", label: "Courses" },
  { id: "resources", label: "Resources" },
  { id: "events", label: "Events" },
  { id: "contact", label: "Contact" },
] as const;

export const fullName = `${profile.firstName} ${profile.lastName}`;
