import { courses as courseSource } from "@/content/courses";
import type { Dictionary } from "@/content/i18n";
import type { Course } from "@/content/types";
import { SKOOL_URL } from "@/lib/config";
import { formatPrice, localize, type Locale, type Localized } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { iconGradient } from "@/lib/cover";
import { ArrowRight } from "../icons";
import { SectionHead } from "../ui";

function CourseCard({ c, i, locale, t }: { c: Localized<Course>; i: number; locale: Locale; t: Dictionary }) {
  const premium = c.tier === "premium";
  const price = premium ? formatPrice(c.price ?? 0, locale) : t.courses.free;
  return (
    <article className={`course glass${premium ? " premium" : ""}`} data-reveal data-tilt data-stagger={i}>
      <div className="top">
        <span className="ic" style={{ background: iconGradient(c.title) }} aria-hidden="true">
          {c.glyph}
        </span>
        <span className={`badge ${premium ? "paid" : "free"}`}>{price}</span>
      </div>
      <div>
        <h4>{c.title}</h4>
        <p style={{ marginTop: ".4rem" }}>{c.description}</p>
      </div>
      <dl className="specs">
        <div><dt>{t.courses.level}</dt><dd>{c.level}</dd></div>
        <div><dt>{t.courses.length}</dt><dd>{c.duration}</dd></div>
        <div><dt>{t.courses.price}</dt><dd>{price}</dd></div>
      </dl>
      <a
        className={`btn ${premium ? "btn-primary" : "btn-glass"}`}
        href={c.url ?? SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {premium ? t.courses.enroll : t.courses.startFree} <ArrowRight />
        <span className="sr-only">: {c.title} {t.common.newTab}</span>
      </a>
    </article>
  );
}

export default async function Courses() {
  const { locale, t } = await getI18n();
  const courses = localize(courseSource, locale);
  const groups = [
    { ...t.courses.groups.free, items: courses.filter((c) => c.tier === "free") },
    { ...t.courses.groups.premium, items: courses.filter((c) => c.tier === "premium") },
  ];
  return (
    <section id="courses" className="section wrap" aria-labelledby="courses-title">
      <SectionHead
        id="courses-title"
        eyebrow={t.courses.eyebrow}
        title={t.courses.title}
        accent={t.courses.accent}
        lede={t.courses.lede}
      />
      <div className="course-groups">
        {groups.map((g) => (
          <div key={g.title}>
            <div className="group-head" data-reveal>
              <h3>{g.title}</h3>
              <span>{g.sub}</span>
            </div>
            <div className="course-grid">
              {g.items.map((c, i) => (
                <CourseCard key={c.title} c={c} i={i} locale={locale} t={t} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
