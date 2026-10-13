"use client";

import { useState } from "react";
import type { Interview, InterviewFormat } from "@/content/types";
import { formatDate } from "@/lib/format";
import type { Localized } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { ArrowRight, FormatIcon } from "../icons";
import FilterBar from "../FilterBar";

const FMT_BG: Record<InterviewFormat, string> = {
  Podcast: "linear-gradient(135deg,#C7B3F5,#F4BFD5)",
  Video: "linear-gradient(135deg,#A9B8F5,#B7D3F0)",
  Article: "linear-gradient(135deg,#D5DAE4,#BFD0F2)",
  Radio: "linear-gradient(135deg,#F4BFD5,#E6C6E4)",
};
const ORDER: InterviewFormat[] = ["Podcast", "Video", "Article", "Radio"];

export default function InterviewList({ items }: { items: Localized<Interview>[] }) {
  const { locale, t } = useI18n();
  const [fmt, setFmt] = useState<"All" | InterviewFormat>("All");
  const formats = ORDER.filter((f) => items.some((i) => i.format === f));
  const list = items.filter((i) => fmt === "All" || i.format === fmt);

  return (
    <div className="iv-side">
      <FilterBar
        label={t.interviews.filter}
        options={[{ value: "All", label: t.common.all }, ...formats.map((f) => ({ value: f, label: t.interviews.format[f] }))]}
        value={fmt}
        onChange={(v) => setFmt(v as typeof fmt)}
      />
      <ul className="iv-list" aria-live="polite">
        {list.map((i, n) => (
          <li key={i.title} className="iv glass" data-reveal data-tilt data-stagger={n} style={{ "--dir": 1 } as React.CSSProperties}>
            <span className="fmt" style={{ background: FMT_BG[i.format] }} aria-hidden="true">
              <FormatIcon format={i.format} />
            </span>
            <div>
              <h4>{i.title}</h4>
              <div className="sub">
                <span>{i.outlet}</span>
                <span>
                  {t.interviews.format[i.format]} · {i.duration}
                </span>
                <time dateTime={i.date}>{formatDate(i.date, locale)}</time>
              </div>
            </div>
            <a className="go" href={i.url} target="_blank" rel="noopener noreferrer" aria-label={t.interviews.openAria(t.interviews.format[i.format], i.title)}>
              <ArrowRight />
            </a>
          </li>
        ))}
        {list.length === 0 && <li className="empty">{t.interviews.empty}</li>}
      </ul>
    </div>
  );
}
