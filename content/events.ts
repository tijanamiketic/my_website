import type { EventItem } from "./types";

/**
 * Times are CET. Past events are hidden automatically.
 * An event without a `date` is shown as "coming soon" (greyed out, registration disabled).
 */
export const events: EventItem[] = [
  {
    title: { sr: "Radionica", en: "Workshop" },
    mode: "In person",
    description: { sr: "Uvod u AI", en: "Introduction to AI" },
  },
];
