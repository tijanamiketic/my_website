"use client";

import { useState, useSyncExternalStore } from "react";
import type { NewsItem, NewsTopic } from "@/content/types";
import { iconGradient } from "@/lib/cover";
import { formatDate, initials, relativeTime } from "@/lib/format";
import { ArrowRight } from "../icons";
import FilterBar from "../FilterBar";
import { useI18n } from "../I18nProvider";

let clientNow = 0;
const noopSubscribe = () => () => {};
const getClientNow = () => (clientNow ||= Date.now()); // stable for the page's lifetime
const getServerNow = () => null;

export default function NewsFeed({ items, live, fetchedAt }: { items: NewsItem[]; live: boolean; fetchedAt: string }) {
  const { locale, t } = useI18n();
  const [topic, setTopic] = useState("All");
  // Relative times depend on "now": the server (and hydration) render absolute
  // dates, then the client switches to "3h ago" without a hydration mismatch.
  const now = useSyncExternalStore(noopSubscribe, getClientNow, getServerNow);

  const topics = [
    { value: "All", label: t.common.all },
    ...[...new Set(items.map((n) => n.topic))].map((v: NewsTopic) => ({ value: v, label: t.news.topic[v] })),
  ];
  const list = items.filter((n) => topic === "All" || n.topic === topic);

  return (
    <>
      <div className="news-bar">
        <FilterBar label={t.news.filter} options={topics} value={topic} onChange={setTopic} />
        <span className="live mono">
          <i aria-hidden="true" />
          {live ? (
            <span>{t.news.live(now ? relativeTime(fetchedAt, now, locale) : formatDate(fetchedAt, locale))}</span>
          ) : (
            <span>{t.news.demo}</span>
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
              <time dateTime={n.date}>{now ? relativeTime(n.date, now, locale) : formatDate(n.date, locale)}</time>
            </div>
            {/* Headlines stay in the feed's language (all current feeds are English). */}
            <h3 lang="en">{n.title}</h3>
            <div className="foot">
              <ul className="chips" aria-label={t.news.tags}>
                <li className="chip">{t.news.topic[n.topic]}</li>
                <li className="chip">{t.news.region[n.region]}</li>
              </ul>
              <a className="link-arrow stretched" href={n.url} target="_blank" rel="noopener noreferrer" aria-label={t.news.readAria(n.title, n.source)}>
                {t.news.read} <ArrowRight />
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
