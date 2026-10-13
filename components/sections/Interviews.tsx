import Image from "next/image";
import portrait from "@/public/images/portrait.png";
import { interviews } from "@/content/interviews";
import { formatDate } from "@/lib/format";
import { Cover, SectionHead } from "../ui";
import InterviewList from "./InterviewList";

const VERB = { Article: "Read feature", Video: "Watch interview", Podcast: "Listen now", Radio: "Listen now" } as const;

export default function Interviews() {
  const featured = interviews.find((i) => i.featured) ?? interviews[0];
  const rest = interviews.filter((i) => i !== featured);
  const outlets = [...new Set(interviews.map((i) => i.outlet))];

  return (
    <section id="interviews" className="section wrap" aria-labelledby="interviews-title">
      <SectionHead
        id="interviews-title"
        eyebrow="Interviews & Press"
        title="In"
        accent="conversation"
        lede="Podcasts, video interviews and features where I talk about AI, education and building in public."
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
              {featured.format} · {featured.outlet}
            </span>
            <a className="play" href={featured.url} target="_blank" rel="noopener noreferrer">
              <i aria-hidden="true">▶</i>
              {VERB[featured.format]} · {featured.duration}
              <span className="sr-only">: {featured.title} (opens in a new tab)</span>
            </a>
          </div>
          <div className="body">
            {featured.quote && <blockquote>{featured.quote}</blockquote>}
            <h3>{featured.title}</h3>
            <div className="iv-meta">
              <span className="chip">{featured.outlet}</span>
              <span className="chip mono">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              </span>
            </div>
          </div>
        </article>
        <InterviewList items={rest} />
      </div>
      <div className="press" data-reveal>
        <span className="mono">AS FEATURED IN</span>
        <ul aria-label="Outlets">
          {outlets.map((o) => (
            <li key={o}>{o}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
