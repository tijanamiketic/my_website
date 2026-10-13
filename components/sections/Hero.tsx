import { profile as profileSource } from "@/content/profile";
import { SKOOL_URL } from "@/lib/config";
import { splitBold } from "@/lib/format";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight } from "../icons";
import HeroPortrait from "./HeroPortrait";

export default async function Hero() {
  const { locale, t } = await getI18n();
  const profile = localize(profileSource, locale);
  return (
    <section id="home" className="hero wrap" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="status glass">
            <span className="dot" aria-hidden="true"><i /></span>
            <span>{profile.status}</span>
          </p>
          <h1 id="hero-title">
            {profile.brand}
            <span className="serif grad-text">{profile.role}</span>
          </h1>
          <p className="tagline">
            {splitBold(profile.tagline).map((part, i) =>
              part.bold ? <strong key={i}>{part.text}</strong> : <span key={i}>{part.text}</span>,
            )}
          </p>
          <div className="cta-row">
            <a className="btn btn-primary" href="#projects">
              {t.hero.viewProjects} <ArrowRight />
            </a>
            <a className="btn btn-glass" href={SKOOL_URL} target="_blank" rel="noopener noreferrer">
              {t.hero.joinCourses}
            </a>
          </div>
          <dl className="hero-meta">
            {profile.stats.map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroPortrait />
      </div>
    </section>
  );
}
