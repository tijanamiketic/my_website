import Image from "next/image";
import portrait from "@/public/images/portrait.png";
import { interviews as interviewSource } from "@/content/interviews";
import { formatDate } from "@/lib/format";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { FormatIcon } from "../icons";
import { Cover, SectionHead } from "../ui";
import InterviewList from "./InterviewList";

export default async function Interviews() {
  const { locale, t } = await getI18n();
  const interviews = localize(interviewSource, locale);
  const featured = interviews.find((i) => i.featured) ?? interviews[0];
  const rest = interviews.filter((i) => i !== featured);
  // The featured piece's questions come first, each linking to that piece
  const items = [...(featured.questions ?? []).map((q) => ({ ...featured, title: q })), ...rest];
  const outlets = [...new Set(interviews.map((i) => i.outlet))];

  return (
    <section id="interviews" className="section wrap" aria-labelledby="interviews-title">
      <SectionHead
        id="interviews-title"
        eyebrow={t.interviews.eyebrow}
        title={t.interviews.title}
        accent={t.interviews.accent}
        lede={t.interviews.lede}
      />
      <div className="iv-grid">
        <article className="iv-feature glass" data-reveal data-tilt style={{ "--dir": -1 } as React.CSSProperties}>
          <div className="iv-media">
            {featured.image ? (
              <Cover title={featured.title} image={featured.image} sizes="(max-width: 900px) 100vw, 640px" />
            ) : (
              <>
                <Cover title={featured.outlet + featured.title} />
                <Image className="guest" src={portrait} alt="" sizes="(max-width: 900px) 50vw, 320px" />
              </>
            )}
            <span className="chip iv-outlet">
              {t.interviews.format[featured.format]} · {featured.outlet}
            </span>
            <a className="play" href={featured.url} target="_blank" rel="noopener noreferrer">
              <i aria-hidden="true">{featured.format === "Article" ? <FormatIcon format="Article" width={16} height={16} /> : "▶"}</i>
              {t.interviews.verb[featured.format]}
              {featured.duration && ` · ${featured.duration}`}
              <span className="sr-only">: {featured.title} {t.common.newTab}</span>
            </a>
          </div>
          <div className="body">
            {featured.quote && <blockquote>{featured.quote}</blockquote>}
            <h3>
              <a className="stretched" href={featured.url} target="_blank" rel="noopener noreferrer">
                {featured.title}
                <span className="sr-only"> {t.common.newTab}</span>
              </a>
            </h3>
            <div className="iv-meta">
              <span className="chip">{featured.outlet}</span>
              <span className="chip mono">
                <time dateTime={featured.date}>{formatDate(featured.date, locale)}</time>
              </span>
            </div>
          </div>
        </article>
        <InterviewList items={items} />
      </div>
      <div className="press" data-reveal>
        <span className="mono">{t.interviews.featuredIn}</span>
        <ul aria-label={t.interviews.outlets}>
          {outlets.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
