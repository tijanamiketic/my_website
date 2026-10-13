import { projects } from "@/content/projects";
import { SectionHead } from "../ui";
import ProjectsCarousel from "./ProjectsCarousel";

export default function Projects() {
  return (
    <section id="projects" className="section" style={{ paddingBottom: "clamp(40px,6vw,70px)" }} aria-labelledby="projects-title">
      <div className="wrap">
        <SectionHead id="projects-title" eyebrow="Projects" title="Things I've" accent="shipped">
          <p className="marquee-hint">
            <kbd>drag</kbd> or swipe · hover to pause
          </p>
        </SectionHead>
      </div>
      <ProjectsCarousel projects={projects} />
    </section>
  );
}
