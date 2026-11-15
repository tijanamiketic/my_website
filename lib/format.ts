import { localeInfo, type Locale } from "./i18n";

/** Parse "YYYY-MM-DD" at noon UTC so the calendar day never shifts with time zones. */
export function parseDay(iso: string): Date {
  return new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
}

/** "22 Oct 2026" (en) / "22. okt 2026." (sr). */
export function formatDate(iso: string, locale: Locale, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }): string {
  return parseDay(iso).toLocaleDateString(localeInfo[locale].intl, { ...options, timeZone: "UTC" });
}

/** Render "**bold**" spans as <strong> (used by the hero tagline). */
export function splitBold(text: string): { bold: boolean; text: string }[] {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((part) =>
    part.startsWith("**") ? { bold: true, text: part.slice(2, -2) } : { bold: false, text: part },
  );
}
