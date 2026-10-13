import { courses } from "@/content/courses";
import type { Course } from "@/content/types";
import { SKOOL_URL } from "@/lib/config";
import { iconGradient } from "@/lib/cover";
import { ArrowRight } from "../icons";
import { SectionHead } from "../ui";

function CourseCard({ c, i }: { c: Course; i: number }) {
  const premium = c.tier === "premium";
  const price = premium ? `€${c.price}` : "Free";
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
        <div><dt>Level</dt><dd>{c.level}</dd></div>
        <div><dt>Length</dt><dd>{c.duration}</dd></div>
        <div><dt>Price</dt><dd>{price}</dd></div>
      </dl>
      <a
        className={`btn ${premium ? "btn-primary" : "btn-glass"}`}
        href={c.url ?? SKOOL_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        {premium ? "Enroll on Skool" : "Start free on Skool"} <ArrowRight />
        <span className="sr-only">: {c.title} (opens in a new tab)</span>
      </a>
    </article>
  );
}

export default function Courses() {
  const groups = [
    { title: "Free", sub: "Start here, no card needed", items: courses.filter((c) => c.tier === "free") },
    { title: "Premium", sub: "Deep dives with feedback and certificates", items: courses.filter((c) => c.tier === "premium") },
  ];
  return (
    <section id="courses" className="section wrap" aria-labelledby="courses-title">
      <SectionHead
        id="courses-title"
        eyebrow="Courses & Trainings"
        title="Learn it"
        accent="properly"
        lede="Every course lives in my Skool community — lessons, live Q&As and a place to share what you build."
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
                <CourseCard key={c.title} c={c} i={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
