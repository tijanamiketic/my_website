import Image from "next/image";
import portrait from "@/public/images/portrait.png";
import { profile as profileSource } from "@/content/profile";
import { fullName } from "@/lib/config";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { PillarIcon } from "../icons";
import { SectionHead } from "../ui";

export default async function About() {
  const { locale, t } = await getI18n();
  const profile = localize(profileSource, locale);
  return (
    <section id="about" className="section wrap" aria-labelledby="about-title">
      <SectionHead id="about-title" eyebrow={t.about.eyebrow} title={t.about.title} accent={t.about.accent} />
      <div className="about-grid">
        <article className="bio glass" data-reveal data-tilt style={{ "--dir": -1 } as React.CSSProperties}>
          <blockquote className="quote">{profile.bio.quote}</blockquote>
          {profile.bio.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <div className="sig">
            <Image src={portrait} alt="" width={44} height={44} sizes="44px" />
            <div>
              <b>{fullName}</b>
              <span>{profile.role}</span>
            </div>
          </div>
        </article>
        <div className="pillars">
          {profile.pillars.map((p, i) => (
            <div key={p.title} className="pillar glass" data-reveal data-tilt data-stagger={i} style={{ "--dir": 1 } as React.CSSProperties}>
              <span className="ic"><PillarIcon name={p.icon} /></span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
