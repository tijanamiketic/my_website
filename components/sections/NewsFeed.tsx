"use client";

import { useState, useSyncExternalStore } from "react";
import type { NewsItem } from "@/content/types";
import { iconGradient } from "@/lib/cover";
import { formatDate, initials, relativeTime } from "@/lib/format";
import { ArrowRight } from "../icons";
import FilterBar from "../FilterBar";

let clientNow = 0;
const noopSubscribe = () => () => {};
const getClientNow = () => (clientNow ||= Date.now()); // stable for the page's lifetime
const getServerNow = () => null;

export default function NewsFeed({ items, live, fetchedAt }: { items: NewsItem[]; live: boolean; fetchedAt: string }) {
  const [topic, setTopic] = useState("All");
  // Relative times depend on "now": the server (and hydration) render absolute
  // dates, then the client switches to "3h ago" without a hydration mismatch.
  const now = useSyncExternalStore(noopSubscribe, getClientNow, getServerNow);

  const topics = ["All", ...new Set(items.map((n) => n.topic))];
  const list = items.filter((n) => topic === "All" || n.topic === topic);

  return (
    <>
      <div className="news-bar">
        <FilterBar label="Filter news by topic" options={topics} value={topic} onChange={setTopic} />
        <span className="live mono">
          <i aria-hidden="true" />
          {live ? (
            <span>Live feed · updated {now ? relativeTime(fetchedAt, now) : formatDate(fetchedAt)}</span>
          ) : (
            <span>Demo feed · mock data</span>
          )}
        </span>
      </div>
      <div className="news-grid" aria-live="polite">
        {list.map((n, i) => (
          <article key={n.url + n.title} className={`news glass${i === 0 ? " lead" : ""}`} data-reveal data-tilt data-stagger={i % 4}>
            <div className="src">
              <span className="av" style={{ background: iconGradient(n.source) }} aria-hidden="true">
                {initials(n.source)}
              </span>
              {n.source}
              <time dateTime={n.date}>{now ? relativeTime(n.date, now) : formatDate(n.date)}</time>
            </div>
            <h3>{n.title}</h3>
            <div className="foot">
              <ul className="chips" aria-label="Tags">
                <li className="chip">{n.topic}</li>
                <li className="chip">{n.region}</li>
              </ul>
              <a className="link-arrow stretched" href={n.url} target="_blank" rel="noopener noreferrer" aria-label={`Read: ${n.title} (${n.source}, new tab)`}>
                Read <ArrowRight />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
