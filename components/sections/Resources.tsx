import { resources } from "@/content/resources";
import { localize } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { SectionHead } from "../ui";
import ResourceLibrary from "./ResourceLibrary";

export default async function Resources() {
  const { locale, t } = await getI18n();
  return (
    <section id="resources" className="section wrap" aria-labelledby="resources-title">
      <SectionHead
        id="resources-title"
        eyebrow={t.resources.eyebrow}
        title={t.resources.title}
        accent={t.resources.accent}
        lede={t.resources.lede}
      />
      <ResourceLibrary resources={localize(resources, locale)} />
    </section>
  );
}
