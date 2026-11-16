import { eventCategories, events } from "@/content/events";
import { eventAction, eventDates, upcomingEvents } from "@/lib/events";
import { formatDate } from "@/lib/format";
import { localePath, localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SectionHead } from "../ui";
import EventList, { type EventCard } from "./EventList";

export default async function Events() {
  const { locale, t } = await getI18n();
  const upcoming = await upcomingEvents(events);
  const list = localize(upcoming, locale);

  // Every category gets a filter, even with no events yet, in the order of content/events.ts.
  const categories = Object.entries(eventCategories).map(([id, c]) => ({ value: id, label: c.label[locale] }));

  const cards: EventCard[] = list.map((ev, i) => {
    const { date, endDate } = ev;
    const fmt = (iso: string, o: Intl.DateTimeFormatOptions) => formatDate(iso, locale, o);
    // Multi-day event: "DEC / 02–03 / sre–čet" (both months when it spans two).
    const span = (o: Intl.DateTimeFormatOptions) => {
      const a = fmt(date!, o);
      const b = endDate && endDate !== date ? fmt(endDate, o) : a;
      return a === b ? a : `${a}–${b}`;
    };
    const action = eventAction(upcoming[i]);
    const external = action ? !action.url.startsWith("/") : false;
    return {
      key: ev.title + (date ?? ""),
      category: ev.category,
      badge: eventCategories[upcoming[i].category].badge[locale],
      title: ev.title,
      description: ev.description,
      note: ev.note,
      modeLabel: t.events.mode[ev.mode],
      online: ev.mode === "Online",
      location: ev.location,
      time: ev.time,
      tile: date
        ? {
            iso: date,
            month: span({ month: "short" }),
            day: span({ day: "2-digit" }),
            weekday: span({ weekday: "short" }),
            range: endDate && endDate !== date ? eventDates(ev, locale) : undefined,
          }
        : null,
      // Seats only make sense for events with registration.
      seats: date && action?.kind === "register" ? (ev.seats ? t.events.seatsLeft(ev.seats) : t.events.openToAll) : undefined,
      action:
        date && action
          ? {
              href: external ? action.url : localePath(locale, action.url),
              external,
              label: action.kind === "notes" ? t.events.readNotes : action.kind === "website" ? t.events.website : t.events.register,
              aria: (action.kind === "notes" ? t.events.readNotesAria : action.kind === "website" ? t.events.websiteAria : t.events.registerAria)(ev.title),
            }
          : null,
    };
  });

  return (
    <section id="events" className="section wrap" aria-labelledby="events-title">
      <SectionHead
        id="events-title"
        eyebrow={t.events.eyebrow}
        title={t.events.title}
        accent={t.events.accent}
        lede={t.events.lede}
      />
      <EventList events={cards} categories={categories} />
    </section>
  );
}
