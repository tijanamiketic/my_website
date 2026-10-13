import { Roboto_Slab } from "next/font/google";
import { profile as profileSource } from "@/content/profile";
import { fullName, SKOOL_URL } from "@/lib/config";
import { splitBold } from "@/lib/format";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { ArrowRight } from "../icons";
import HeroPortrait from "./HeroPortrait";

// Name font, used only here (latin-ext covers "ć"). Loaded in this component so only pages with the hero preload it.
const robotoSlab = Roboto_Slab({ subsets: ["latin", "latin-ext"], weight: "500", variable: "--font-roboto-slab", display: "swap" });

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
          <h1 id="hero-title" className={robotoSlab.variable}>
            <span className="hero-name">{fullName}</span>
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
