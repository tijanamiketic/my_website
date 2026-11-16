import type { EventItem, Text } from "./types";

/**
 * Event categories, in the order their filters appear (after "All").
 * Every filter is shown, even when no event uses it yet (it then shows a "coming soon" message).
 * `label` is the filter chip, `badge` is the small role badge on each card.
 * To add a category, add a line here with both languages. No component changes are needed.
 */
export const eventCategories = {
  workshops: { label: { sr: "Radionice", en: "Workshops" }, badge: { sr: "Radionica", en: "Workshop" } },
  meetups: { label: { sr: "Meetupovi", en: "Meetups" }, badge: { sr: "Meetup", en: "Meetup" } },
  speaking: { label: { sr: "Kao predavač", en: "Speaking" }, badge: { sr: "Predavač", en: "Speaker" } },
  attending: { label: { sr: "Kao posetilac", en: "Attending" }, badge: { sr: "Posetilac", en: "Attending" } },
} satisfies Record<string, { label: Text; badge: Text }>;

export type EventCategory = keyof typeof eventCategories;

/**
 * The Events section. Order here doesn't matter: events with a date are sorted soonest first,
 * undated ("coming soon") ones go last. Times are CET. Past events are hidden automatically.
 *
 * The card's button: `notes` (my notes post, "Pročitaj beleške" / "Read my notes") if set,
 * otherwise `website` ("Zvanični sajt" / "Official website"), otherwise `url` (registration).
 * See EventItem in content/types.ts for every field.
 */
export const events: EventItem<EventCategory>[] = [
  {
    title: { sr: "Tech Spirit Barcelona 2026", en: "Tech Spirit Barcelona 2026" },
    category: "attending",
    date: "2026-12-02",
    endDate: "2026-12-03",
    mode: "In person",
    location: { sr: "Barselona, Španija", en: "Barcelona, Spain" },
    description: {
      sr: "Idem kao posetilac. Posle konferencije ovde delim svoje beleške, zaključke i lično mišljenje o onome što sam čula i naučila.",
      en: "I'm attending as a guest. After the conference I'll share my own notes, takeaways and personal opinion on what I heard and learned here.",
    },
    note: {
      sr: "Nisam deo organizacije niti predavač na ovom događaju. Beleške su moje lično viđenje, a ne zvanični materijal konferencije.",
      en: "I'm not part of the organising team or a speaker at this event. My notes are my personal view, not official conference material.",
    },
    // website: "https://…",  // the official site; shows the "Zvanični sajt" / "Official website" button (until then: disabled "Uskoro")
    // notes: "/blog/<slug>",  // add when the notes post is out: the button becomes "Pročitaj beleške" / "Read my notes"
  },
  {
    title: { sr: "Radionica", en: "Workshop" },
    category: "workshops",
    mode: "In person",
    description: { sr: "Uvod u AI", en: "Introduction to AI" },
  },
];
