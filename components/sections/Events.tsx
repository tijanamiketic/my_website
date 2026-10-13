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
            const fmt = (o: Intl.DateTimeFormatOptions) => formatDate(ev.date, locale, o);
            return (
              <li key={ev.title + ev.date} className="event glass" data-reveal data-tilt style={{ "--dir": i % 2 ? 1 : -1 } as React.CSSProperties}>
                <time className="date" dateTime={ev.date}>
                  <small>{fmt({ month: "short" })}</small>
                  <b>{fmt({ day: "2-digit" })}</b>
                  <small>{fmt({ weekday: "short" })}</small>
                </time>
                <div>
                  <ul className="where chips" aria-label={t.common.details}>
                    <li className="chip">{ev.mode === "Online" ? "● " : "◆ "}{t.events.mode[ev.mode]}</li>
                    <li className="chip">{ev.location}</li>
                    <li className="chip mono">{ev.time} CET</li>
                  </ul>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                </div>
                <div className="side">
                  <span className="seats">{ev.seats ? t.events.seatsLeft(ev.seats) : t.events.openToAll}</span>
                  <a className="btn btn-primary btn-sm" href={ev.url} target="_blank" rel="noopener noreferrer" aria-label={t.events.registerAria(ev.title)}>
                    {t.events.register} <ArrowRight />
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
