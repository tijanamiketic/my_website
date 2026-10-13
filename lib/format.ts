/** Parse "YYYY-MM-DD" at noon UTC so the calendar day never shifts with time zones. */
export function parseDay(iso: string): Date {
  return new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso);
}

export function formatDate(iso: string): string {
  return parseDay(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export function relativeTime(iso: string, now: number): string {
  const h = Math.max(1, Math.round((now - new Date(iso).getTime()) / 36e5));
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 14 ? `${d}d ago` : formatDate(iso);
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
