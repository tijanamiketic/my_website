"use client";

import type { Interview, InterviewFormat } from "@/content/types";
import { formatDate } from "@/lib/format";
import type { Localized } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { ArrowRight, FormatIcon } from "../icons";

const FMT_BG: Record<InterviewFormat, string> = {
  Podcast: "linear-gradient(135deg,#C7B3F5,#F4BFD5)",
  Video: "linear-gradient(135deg,#A9B8F5,#B7D3F0)",
  Article: "linear-gradient(135deg,#D5DAE4,#BFD0F2)",
  Radio: "linear-gradient(135deg,#F4BFD5,#E6C6E4)",
};

export default function InterviewList({ items }: { items: Localized<Interview>[] }) {
  const { locale, t } = useI18n();

  return (
    <div className="iv-side">
      <ul className="iv-list">
        {items.map((i, n) => (
          <li key={i.title} className="iv glass" data-reveal data-tilt data-stagger={n} style={{ "--dir": 1 } as React.CSSProperties}>
            <span className="fmt" style={{ background: FMT_BG[i.format] }} aria-hidden="true">
              <FormatIcon format={i.format} />
            </span>
            <div>
              <h4>{i.title}</h4>
              <div className="sub">
                <span>
                  {/* Non-breaking space keeps each "·" with the word before it when the line wraps */}
                  {i.outlet}&nbsp;· {t.interviews.format[i.format]}
                  {i.duration && <>&nbsp;· {i.duration}</>}&nbsp;· <time dateTime={i.date}>{formatDate(i.date, locale)}</time>
                </span>
              </div>
            </div>
            {/* Stretched: the whole card opens the link */}
            <a className="go stretched" href={i.url} target="_blank" rel="noopener noreferrer" aria-label={t.interviews.openAria(t.interviews.format[i.format], i.title)}>
              <ArrowRight />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
