import { resourceCategories } from "@/content/resources";
import { localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import { getResources } from "@/lib/resources";
import { SectionHead } from "../ui";
import ResourceLibrary from "./ResourceLibrary";

export default async function Resources() {
  const { locale, t } = await getI18n();
  const docs = getResources();
  // One filter per category that has at least one resource, in the order of content/resources.ts.
  const categories = Object.entries(resourceCategories)
    .filter(([id]) => docs.some((d) => d.category === id))
    .map(([id, label]) => ({ value: id, label: label[locale] }));
  const items = docs.map((d) => ({
    ...d,
    categoryLabel: resourceCategories[d.category][locale],
    href: localePath(locale, `/resources/${d.slug}`),
  }));

  return (
    <section id="resources" className="section wrap" aria-labelledby="resources-title">
      <SectionHead
        id="resources-title"
        eyebrow={t.resources.eyebrow}
        title={t.resources.title}
        accent={t.resources.accent}
        lede={t.resources.lede}
      />
      <ResourceLibrary resources={items} categories={categories} />
    </section>
  );
}
