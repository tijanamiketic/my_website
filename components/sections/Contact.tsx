import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { fullName } from "@/lib/config";
import { getI18n } from "@/lib/i18n/server";
import { SocialIcon } from "../icons";
import CopyEmail from "./CopyEmail";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export default async function Contact() {
  const year = await currentYear();
  const { t } = await getI18n();
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
        </div>
        <div className="contact-links">
          <CopyEmail email={profile.email} />
          <ul className="socials" aria-label={t.contact.socials}>
            {socials.map((s) => {
              const icon = (
                <span className="ic" style={{ background: s.color }} aria-hidden="true">
                  <SocialIcon name={s.name} />
                </span>
              );
              return (
                <li key={s.name}>
                  {s.url ? (
                    <a className="social" href={s.url} target="_blank" rel="noopener noreferrer">
                      {icon}
                      <span>
                        <b>{s.name}</b>
                        <small>{s.handle}</small>
                      </span>
                    </a>
                  ) : (
                    <span className="social soon" role="link" aria-disabled="true" aria-label={t.contact.socialSoon(s.name)}>
                      {icon}
                      <span>
                        <b>{s.name}</b>
                        <small className="mono">{t.contact.comingSoon}</small>
                      </span>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <footer className="foot">
        <span>
          © {year} {fullName}
        </span>
      </footer>
    </section>
  );
}
