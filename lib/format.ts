import { dictionaries } from "@/content/i18n";
import { localeInfo, type Locale } from "./i18n";

/** Parse "YYYY-MM-DD" at noon UTC so the calendar day never shifts with time zones. */
export function parseDay(iso: string): Date {
  return new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
}

/** "22 Oct 2026" (en) / "22. okt 2026." (sr). */
export function formatDate(iso: string, locale: Locale, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return parseDay(iso).toLocaleDateString(localeInfo[locale].intl, { ...options, timeZone: "UTC" });
}

export function relativeTime(iso: string, now: number, locale: Locale): string {
  const { time } = dictionaries[locale];
  const h = Math.max(1, Math.round((now - new Date(iso).getTime()) / 36e5));
  if (h < 24) return time.hoursAgo(h);
  const d = Math.round(h / 24);
  return d < 14 ? time.daysAgo(d) : formatDate(iso, locale);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/** Render "**bold**" spans as <strong> (used by the hero tagline). */
export function splitBold(text: string): { bold: boolean; text: string }[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith("**") ? { bold: true, text: part.slice(2, -2) } : { bold: false, text: part },
  );
}
