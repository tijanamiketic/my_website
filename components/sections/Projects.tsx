import { projects } from "@/content/projects";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SectionHead } from "../ui";
import ProjectsCarousel from "./ProjectsCarousel";

export default async function Projects() {
  const { locale, t } = await getI18n();
  return (
    <section id="projects" className="section" style={{ paddingBottom: "clamp(40px,6vw,70px)" }} aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" eyebrow={t.projects.eyebrow} title={t.projects.title} accent={t.projects.accent} />
      </div>
      <ProjectsCarousel projects={localize(projects, locale)} />
    </section>
  );
}
