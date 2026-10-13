/**
 * Shared content types. Every file in /content is typed against these, so
 * TypeScript will tell you if a field is missing or misspelled.
 */

export type Profile = {
  firstName: string;
  lastName: string;
  /** Shown in the navbar brand and browser tab. */
  brand: string;
  role: string;
  /** Hero tagline. Wrap a phrase in **double asterisks** to make it bold. */
  tagline: string;
  status: string;
  email: string;
  location: string;
  skoolUrl: string;
  stats: { value: string; label: string }[];
  /** The three floating glass badges around the hero portrait. */
  badges: [Badge, Badge, Badge];
  bio: { quote: string; paragraphs: string[] };
  pillars: { icon: "code" | "cap" | "spark"; title: string; text: string }[];
  newsletter: { title: string; text: string; perks: string[] };
  /** Used for SEO / JSON-LD. */
  seo: { description: string; keywords: string[] };
};

export type Badge = { glyph: string; title: string; subtitle: string };

export type Project = {
  title: string;
  description: string;
  tags: string[];
  year: string;
  url: string;
  /** Path under /public or a remote URL. Leave undefined for a generated gradient cover. */
  image?: string;
  /** Short symbol drawn on the generated cover. */
  glyph?: string;
};

export type InterviewFormat = "Podcast" | "Video" | "Article" | "Radio";

export type Interview = {
  title: string;
  outlet: string;
  format: InterviewFormat;
  /** ISO date, e.g. "2026-09-12". */
  date: string;
  duration: string;
  url: string;
  quote?: string;
  featured?: boolean;
  image?: string;
};

export type Course = {
  title: string;
  tier: "free" | "premium";
  level: string;
  duration: string;
  /** Price in EUR. Ignored for free courses. */
  price?: number;
  description: string;
  glyph: string;
  /** Optional deep link; defaults to the Skool community URL. */
  url?: string;
};

export type ResourceType = "PDF" | "Template" | "Checklist" | "Notebook" | "Guide";

export type Resource = {
  title: string;
  type: ResourceType;
  category: string;
  size: string;
  /** ISO date. */
  updated: string;
  description: string;
  /** File in /public/resources (e.g. "/resources/prompt-patterns.pdf") or an external URL. */
  url: string;
};

export type EventItem = {
  title: string;
  /** ISO date, e.g. "2026-10-22". */
  date: string;
  /** Local time range in CET, e.g. "18:00–19:30". */
  time: string;
  mode: "Online" | "In person";
  location: string;
  description: string;
  /** Seats left; null = open / unlimited. */
  seats: number | null;
  url: string;
};

export type Social = {
  name: "LinkedIn" | "YouTube" | "Instagram" | "GitHub" | "Skool";
  handle: string;
  url: string;
  color: string;
};

export type NewsTopic = "Research" | "Policy" | "Industry" | "Open source" | "Education";
export type NewsRegion = "Global" | "Europe" | "Americas" | "Asia" | "Africa";

export type NewsItem = {
  source: string;
  region: NewsRegion;
  topic: NewsTopic;
  /** ISO date-time. */
  date: string;
  title: string;
  url: string;
};

export type NewsSource = {
  name: string;
  url: string;
  region: NewsRegion;
  /** Default topic for this feed when an item can't be classified from its title. */
  topic: NewsTopic;
  /** For general tech feeds: keep only headlines that mention AI (see `aiKeywords`). */
  aiOnly?: boolean;
};
