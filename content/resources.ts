import type { Resource, Text } from "./types";

/**
 * Resource categories, in the order their filters appear (after "All").
 * A filter is shown only when at least one resource uses its category.
 */
export const resourceCategories = {
  documentation: { sr: "Dokumentacija", en: "Documentation" },
} satisfies Record<string, Text>;

export type ResourceCategory = keyof typeof resourceCategories;

/**
 * The Resources section, in display order. To add a document: copy the Markdown note to
 * public/resources/<slug>.md unchanged, then add an entry here. See docs/how-to-change.md.
 */
export const resources: Resource<ResourceCategory>[] = [
  { slug: "documentation-standard", category: "documentation", lang: "en", updated: "2026-10-10" },
];
