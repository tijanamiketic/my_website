import { cacheLife } from "next/cache";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { fullName } from "@/lib/config";
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
  return (
    <section id="contact" className="section wrap" style={{ paddingBottom: 0 }} aria-labelledby="contact-title">
      <div className="contact glass" data-reveal>
        <div>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-title">
            Building something <span className="serif grad-text">with AI?</span>
          </h2>
          <p className="lede" style={{ marginTop: "1rem" }}>
            Speaking, workshops for teams, or a collaboration — write to me directly.
          </p>
          <CopyEmail email={profile.email} />
          <ul className="socials" aria-label="Social profiles">
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
        <span>Designed with glass, gradients and a lot of coffee.</span>
      </footer>
    </section>
  );
}
