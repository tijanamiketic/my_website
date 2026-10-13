import { cacheLife } from "next/cache";
import { profile as profileSource } from "@/content/profile";
import { socials } from "@/content/socials";
import { fullName } from "@/lib/config";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SocialIcon } from "../icons";
import CopyEmail from "./CopyEmail";
import NewsletterForm from "./NewsletterForm";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Contact() {
  const year = await currentYear();
  const { locale, t } = await getI18n();
  const profile = localize(profileSource, locale);
  return (
    <section id="contact" className="section wrap" style={{ paddingBottom: 0 }} aria-labelledby="contact-title">
      <div className="contact glass" data-reveal>
        <div>
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 id="contact-title">
            {t.contact.title} <span className="serif grad-text">{t.contact.accent}</span>
          </h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            {t.contact.lede}
          </p>
          <CopyEmail email={profile.email} />
          <ul className="socials" aria-label={t.contact.socials}>
            {socials.map((s) => (
              <li key={s.name}>
                <a className="social" href={s.url} target="_blank" rel="noopener noreferrer me">
                  <span className="ic" style={{ background: s.color }} aria-hidden="true">
                    <SocialIcon name={s.name} />
                  </span>
                  <span>
                    <b>{s.name}</b>
                    <small>{s.handle}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="newsletter">
          <h3>{profile.newsletter.title}</h3>
          <p>{profile.newsletter.text}</p>
          <NewsletterForm />
          <ul className="perks">
            {profile.newsletter.perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>
      <footer className="foot">
        <span>
          © {year} {fullName}
        </span>
        <span>{t.contact.footer}</span>
      </footer>
    </section>
  );
}
