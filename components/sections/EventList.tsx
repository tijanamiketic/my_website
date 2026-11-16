"use client";

import Link from "next/link";
import { useI18n } from "../I18nProvider";
import { ArrowRight } from "../icons";
import FilterPanel, { ALL, useFilteredList } from "../FilterPanel";

/** One event card, already localized and formatted on the server (see Events.tsx). */
export type EventCard = {
  key: string;
  category: string;
  /** Role badge, e.g. "Posetilac" / "Attending". */
  badge: string;
  title: string;
  description: string;
  note?: string;
  modeLabel: string;
  online: boolean;
  location?: string;
  time?: string;
  /** Date tile; null = "coming soon". `range` is the full date range for screen readers (multi-day events). */
  tile: { iso: string; month: string; day: string; weekday: string; range?: string } | null;
  seats?: string;
  action: { href: string; label: string; aria: string; external: boolean } | null;
};

/** Search + category filter over the event timeline. */
export default function EventList({ events, categories }: { events: EventCard[]; categories: { value: string; label: string }[] }) {
  const { t } = useI18n();
  const { cat, setCat, query, setQuery, list } = useFilteredList(
    events,
    (e) => e.category,
    (e) => [e.title, e.description, e.note, e.badge, e.location, e.modeLabel].filter(Boolean).join(" "),
  );

  const empty = query.trim() ? t.events.noMatch(query) : events.length === 0 && cat === ALL ? t.events.empty : t.events.emptyCategory;

  return (
    <FilterPanel
      searchLabel={t.events.searchLabel}
      searchPlaceholder={t.events.searchPlaceholder}
      filterLabel={t.events.filter}
      options={[{ value: ALL, label: t.common.all }, ...categories]}
      cat={cat}
      onCat={setCat}
      query={query}
      onQuery={setQuery}
      count={t.events.count(list.length, events.length)}
    >
      {list.length === 0 ? (
        <p className="empty">{empty}</p>
      ) : (
        <ol className="timeline">
          {list.map((ev, i) => {
            const { tile } = ev;
            return (
              // No date yet = "coming soon": greyed out, no tilt/glow, no time, seats or button link.
              <li
                key={ev.key}
                className={`event glass${tile ? "" : " soon"}`}
                data-reveal
                data-tilt={tile ? "" : undefined}
                style={{ "--dir": i % 2 ? 1 : -1 } as React.CSSProperties}
              >
                {tile ? (
                  <time className={`date${tile.range ? " range" : ""}`} dateTime={tile.iso}>
                    <span aria-hidden={tile.range ? true : undefined}>
                      <small>{tile.month}</small>
                      <b>{tile.day}</b>
                      <small>{tile.weekday}</small>
                    </span>
                    {tile.range && <span className="sr-only">{tile.range}</span>}
                  </time>
                ) : (
                  <span className="date">
                    <b>{t.events.soonDate}</b>
                  </span>
                )}
                <div>
                  <ul className="where chips" aria-label={t.common.details}>
                    <li className="chip">{ev.online ? "● " : "◆ "}{ev.modeLabel}</li>
                    <li className="chip">{ev.badge}</li>
                    {ev.location && <li className="chip">{ev.location}</li>}
                    {ev.time && <li className="chip mono">{ev.time} CET</li>}
                  </ul>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                  {ev.note && <p className="note">{ev.note}</p>}
                </div>
                <div className="side">
                  {ev.seats && <span className="seats">{ev.seats}</span>}
                  {ev.action ? (
                    ev.action.external ? (
                      <a className="btn btn-primary btn-sm" href={ev.action.href} target="_blank" rel="noopener noreferrer" aria-label={ev.action.aria}>
                        {ev.action.label} <ArrowRight />
                      </a>
                    ) : (
                      <Link className="btn btn-primary btn-sm" href={ev.action.href} aria-label={ev.action.aria}>
                        {ev.action.label} <ArrowRight />
                      </Link>
                    )
                  ) : (
                    <span className="btn btn-primary btn-sm" aria-disabled="true">
                      {t.events.comingSoon}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </FilterPanel>
  );
}
