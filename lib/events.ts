import { cacheLife } from "next/cache";
import type { EventItem } from "@/content/types";
import { parseDay } from "./format";

/**
 * Events that haven't happened yet, soonest first, followed by undated ("coming soon") ones.
 * Cached and refreshed hourly, so past events drop off without a redeploy.
 */
export async function upcomingEvents(all: EventItem[]): Promise<EventItem[]> {
  "use cache";
  cacheLife("hours");
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return all
    .filter((e) => !e.date || parseDay(e.date).getTime() >= startOfToday.getTime())
    .sort((a, b) => (a.date ?? "￿").localeCompare(b.date ?? "￿"));
}
