import { events } from "@/content/events";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight } from "../icons";
import { SectionHead } from "../ui";
import { upcomingEvents } from "@/lib/events";

export default async function Events() {
  const { locale, t } = await getI18n();
  const list = localize(await upcomingEvents(events), locale);
  return (
    <section id="events" className="section wrap" aria-labelledby="events-title">
      <SectionHead
        id="events-title"
        eyebrow={t.events.eyebrow}
        title={t.events.title}
        accent={t.events.accent}
        lede={t.events.lede}
      />
      {list.length === 0 ? (
        <p className="glass empty">{t.events.empty}</p>
      ) : (
        <ol className="timeline">
          {list.map((ev, i) => {
            const { date } = ev;
            const fmt = (o: Intl.DateTimeFormatOptions) => formatDate(date!, locale, o);
            return (
              // No date yet = "coming soon": greyed out, no tilt/glow, no time, seats or registration.
              <li
                key={ev.title + (date ?? "")}
                className={`event glass${date ? "" : " soon"}`}
                data-reveal
                data-tilt={date ? "" : undefined}
                style={{ "--dir": i % 2 ? 1 : -1 } as React.CSSProperties}
              >
                {date ? (
                  <time className="date" dateTime={date}>
                    <small>{fmt({ month: "short" })}</small>
                    <b>{fmt({ day: "2-digit" })}</b>
                    <small>{fmt({ weekday: "short" })}</small>
                  </time>
                ) : (
                  <span className="date">
                    <b>{t.events.soonDate}</b>
                  </span>
                )}
                <div>
                  <ul className="where chips" aria-label={t.common.details}>
                    <li className="chip">{ev.mode === "Online" ? "● " : "◆ "}{t.events.mode[ev.mode]}</li>
                    {ev.location && <li className="chip">{ev.location}</li>}
                    {ev.time && <li className="chip mono">{ev.time} CET</li>}
                  </ul>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                </div>
                <div className="side">
                  {date && <span className="seats">{ev.seats ? t.events.seatsLeft(ev.seats) : t.events.openToAll}</span>}
                  {date && ev.url ? (
                    <a className="btn btn-primary btn-sm" href={ev.url} target="_blank" rel="noopener noreferrer" aria-label={t.events.registerAria(ev.title)}>
                      {t.events.register} <ArrowRight />
                    </a>
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
    </section>
  );
}
