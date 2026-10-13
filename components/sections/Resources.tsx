import { resources } from "@/content/resources";
import { SectionHead } from "../ui";
import ResourceLibrary from "./ResourceLibrary";

export default function Resources() {
  return (
    <section id="resources" className="section wrap" aria-labelledby="resources-title">
      <SectionHead
        id="resources-title"
        eyebrow="Resources"
        title="The"
        accent="library"
        lede="Guides, templates and cheat sheets I use in my own work and classes. Free to open and adapt."
      />
      <ResourceLibrary resources={resources} />
    </section>
  );
}
