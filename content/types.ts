import type { Text } from "@/lib/i18n";

/**
 * Shared content types. Every file in /content is typed against these, so
 * TypeScript will tell you if a field is missing or misspelled.
 *
 * Fields typed `Text` are shown to visitors and need one value per language:
 * { sr: "…", en: "…" }. Names, URLs, dates, prices and other facts are stored once.
 */

export type { Text };

export type Profile = {
  firstName: string;
  lastName: string;
  /** Shown in the navbar brand and browser tab. */
  brand: string;
  role: Text;
  /** Hero tagline. Wrap a phrase in **double asterisks** to make it bold. */
  tagline: Text;
  status: Text;
  email: string;
  location: Text;
  skoolUrl: string;
  stats: { value: string; label: Text }[];
  bio: { quote: Text; paragraphs: Text[] };
  pillars: { icon: "code" | "cap" | "spark"; title: Text; text: Text }[];
  /** `title` is the newsletter's name and is not translated. */
  newsletter: { title: string; text: Text; perks: Text[] };
  /** Used for SEO / JSON-LD. */
  seo: { description: Text; keywords: Text[] };
};

export type Project = {
  /** Product name: not translated. */
  title: string;
  description: Text;
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
  title: Text;
  outlet: string;
  /** Shown translated, via the `interviews.format` labels in content/i18n. */
  format: InterviewFormat;
  /** ISO date, e.g. "2026-09-12". */
  date: string;
  /** e.g. "58 min"; leave out when it doesn't apply. */
  duration?: Text;
  url: string;
  quote?: Text;
  /** Questions answered in the piece, listed as separate items that all link to `url`. */
  questions?: Text[];
  featured?: boolean;
  image?: string;
};

export type Course = {
  title: Text;
  tier: "free" | "premium";
  level: Text;
  duration: Text;
  /** Price in EUR. Ignored for free courses. */
  price?: number;
  description: Text;
  glyph: string;
  /** Optional deep link; defaults to the Skool community URL. */
  url?: string;
};

export type ResourceType = "PDF" | "Template" | "Checklist" | "Notebook" | "Guide";

export type Resource = {
  title: Text;
  /** Shown translated, via the `resources.type` labels in content/i18n. */
  type: ResourceType;
  category: Text;
  size: Text;
  /** ISO date. */
  updated: string;
  description: Text;
  /** File in /public/resources (e.g. "/resources/prompt-patterns.pdf") or an external URL. */
  url: string;
};

export type EventItem = {
  title: Text;
  /** ISO date, e.g. "2026-10-22". */
  date: string;
  /** Local time range in CET, e.g. "18:00–19:30". */
  time: string;
  /** Shown translated, via the `events.mode` labels in content/i18n. */
  mode: "Online" | "In person";
  location: Text;
  description: Text;
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

/** Headlines come from third-party feeds and stay in their original language. */
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
