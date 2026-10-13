import { events } from "@/content/events";
import { parseDay } from "@/lib/format";
import { ArrowRight } from "../icons";
import { SectionHead } from "../ui";
import { upcomingEvents } from "@/lib/events";

export default async function Events() {
  const list = await upcomingEvents(events);
  return (
    <section id="events" className="section wrap" aria-labelledby="events-title">
      <SectionHead
        id="events-title"
        eyebrow="Upcoming events"
        title="Let's meet"
        accent="live"
        lede="Workshops, talks and community sessions. All times shown in Central European Time."
      />
      {list.length === 0 ? (
        <p className="glass empty">No events scheduled right now — join the newsletter to hear about the next one.</p>
      ) : (
        <ol className="timeline">
          {list.map((ev, i) => {
            const d = parseDay(ev.date);
            const fmt = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-GB", { ...o, timeZone: "UTC" });
            return (
              <li key={ev.title + ev.date} className="event glass" data-reveal data-tilt style={{ "--dir": i % 2 ? 1 : -1 } as React.CSSProperties}>
                <time className="date" dateTime={ev.date}>
                  <small>{fmt({ month: "short" })}</small>
                  <b>{fmt({ day: "2-digit" })}</b>
                  <small>{fmt({ weekday: "short" })}</small>
                </time>
                <div>
                  <ul className="where chips" aria-label="Details">
                    <li className="chip">{ev.mode === "Online" ? "● Online" : "◆ In person"}</li>
                    <li className="chip">{ev.location}</li>
                    <li className="chip mono">{ev.time} CET</li>
                  </ul>
                  <h3>{ev.title}</h3>
                  <p>{ev.description}</p>
                </div>
                <div className="side">
                  <span className="seats">{ev.seats ? `${ev.seats} seats left` : "Open to all"}</span>
                  <a className="btn btn-primary btn-sm" href={ev.url} target="_blank" rel="noopener noreferrer" aria-label={`Register for ${ev.title} (new tab)`}>
                    Register <ArrowRight />
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
