import { cacheLife } from "next/cache";
import type { EventItem } from "@/content/types";
import { formatDate, parseDay } from "./format";
import type { Locale } from "./i18n";

/**
 * Events that haven't ended yet, soonest first, followed by undated ("coming soon") ones.
 * Cached and refreshed hourly, so past events drop off without a redeploy.
 */
export async function upcomingEvents<T extends EventItem>(all: T[]): Promise<T[]> {
  "use cache";
  cacheLife("hours");
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return all
    .filter((e) => !e.date || parseDay(e.endDate ?? e.date).getTime() >= startOfToday.getTime())
    .sort((a, b) => (a.date ?? "￿").localeCompare(b.date ?? "￿"));
}

const real = (url?: string) => (url && url !== "#" ? url : undefined);

/** Where an event's button leads: my notes once published, else the official site, else registration. */
export function eventAction(e: Pick<EventItem, "notes" | "website" | "url">): { kind: "notes" | "website" | "register"; url: string } | null {
  if (real(e.notes)) return { kind: "notes", url: e.notes! };
  if (real(e.website)) return { kind: "website", url: e.website! };
  if (real(e.url)) return { kind: "register", url: e.url! };
  return null;
}

/** "2 Dec 2026" or "2 Dec 2026 – 3 Dec 2026" for a multi-day event. Empty when there is no date. */
export function eventDates(e: Pick<EventItem, "date" | "endDate">, locale: Locale): string {
  if (!e.date) return "";
  const start = formatDate(e.date, locale);
  return e.endDate && e.endDate !== e.date ? `${start} – ${formatDate(e.endDate, locale)}` : start;
}
