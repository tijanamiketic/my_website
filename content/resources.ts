import type { Resource } from "./types";

/**
 * MOCK resource library. Put files in /public/resources and reference them as
 * "/resources/<file>", or use an external URL (Google Drive, Notion, GitHub…).
 * The first entry points at a real sample file so you can see the flow.
 */
export const resources: Resource[] = [
  {
    title: { sr: "Priručnik obrazaca za promptove", en: "The Prompt Patterns Handbook" },
    type: "PDF",
    category: { sr: "Promptovanje", en: "Prompting" },
    size: { sr: "42 strane", en: "42 pages" },
    updated: "2026-09-10",
    description: { sr: "24 obrasca za promptove koje možeš ponovo da koristiš, sa primerima i antiobrascima.", en: "24 reusable prompt patterns with examples and anti-patterns." },
    url: "/resources/prompt-patterns-sample.md",
  },
  {
    title: { sr: "Platno za dizajn agenta", en: "Agent Design Canvas" },
    type: "Template",
    category: { sr: "Agenti", en: "Agents" },
    size: { sr: "Figma + PDF", en: "Figma + PDF" },
    updated: "2026-09-02",
    description: { sr: "Platno na jednoj strani za planiranje ciljeva, alata, memorije i zaštitnih mehanizama agenta.", en: "A one-page canvas to plan an agent's goals, tools, memory and guardrails." },
    url: "#",
  },
  {
    title: { sr: "Kontrolna lista za evaluaciju RAG-a", en: "RAG Evaluation Checklist" },
    type: "Checklist",
    category: { sr: "RAG", en: "RAG" },
    size: { sr: "2 strane", en: "2 pages" },
    updated: "2026-08-28",
    description: { sr: "30 provera za kvalitet pretrage, utemeljenost odgovora i tačnost citata.", en: "30 checks for retrieval quality, grounding and citation accuracy." },
    url: "#",
  },
  {
    title: { sr: "Početni notebook: embedinzi", en: "Starter Notebook: Embeddings" },
    type: "Notebook",
    category: { sr: "RAG", en: "RAG" },
    size: { sr: "Jupyter", en: "Jupyter" },
    updated: "2026-08-19",
    description: { sr: "Praktičan uvod u embedinge, pretragu po sličnosti i klasterovanje.", en: "Hands-on intro to embeddings, similarity search and clustering." },
    url: "#",
  },
  {
    title: { sr: "Šablon plana časa uz AI", en: "AI Lesson Plan Template" },
    type: "Template",
    category: { sr: "Nastava", en: "Teaching" },
    size: { sr: "Docs", en: "Docs" },
    updated: "2026-08-12",
    description: { sr: "Strukturisan šablon za pripremu časa uz pomoć AI-ja, sa rubrikom za ocenjivanje.", en: "A structured template for AI-assisted lesson design with rubric." },
    url: "#",
  },
  {
    title: { sr: "Početni paket sistemskih promptova", en: "System Prompt Starter Kit" },
    type: "Guide",
    category: { sr: "Promptovanje", en: "Prompting" },
    size: { sr: "18 strana", en: "18 pages" },
    updated: "2026-07-30",
    description: { sr: "Sistemski promptovi sa komentarima za asistente, tutore i botove za podršku.", en: "Annotated system prompts for assistants, tutors and support bots." },
    url: "#",
  },
  {
    title: { sr: "Podsetnik za pozivanje alata", en: "Tool-Calling Cheat Sheet" },
    type: "PDF",
    category: { sr: "Agenti", en: "Agents" },
    size: { sr: "4 strane", en: "4 pages" },
    updated: "2026-07-22",
    description: { sr: "Šeme, obrada grešaka i ponovni pokušaji za pouzdano korišćenje alata.", en: "Schemas, error handling and retries for reliable tool use." },
    url: "#",
  },
  {
    title: { sr: "Nedeljni planer AI tokova rada", en: "Weekly AI Workflow Planner" },
    type: "Template",
    category: { sr: "Produktivnost", en: "Productivity" },
    size: { sr: "Notion", en: "Notion" },
    updated: "2026-07-15",
    description: { sr: "Planiraj i prati AI tokove rada koji ti štede najviše vremena.", en: "Plan and track the AI workflows that save you the most time." },
    url: "#",
  },
  {
    title: { sr: "Pravila korišćenja AI-ja u učionici", en: "AI Policy for Classrooms" },
    type: "Guide",
    category: { sr: "Nastava", en: "Teaching" },
    size: { sr: "12 strana", en: "12 pages" },
    updated: "2026-07-01",
    description: { sr: "Primer pravila korišćenja AI-ja koji možeš da prilagodiš svojoj školi ili kursu.", en: "A sample AI use policy you can adapt for your school or course." },
    url: "#",
  },
  {
    title: { sr: "Prompt: od beleški sa sastanka do zadataka", en: "Meeting Notes → Actions Prompt" },
    type: "Checklist",
    category: { sr: "Produktivnost", en: "Productivity" },
    size: { sr: "1 strana", en: "1 page" },
    updated: "2026-06-20",
    description: { sr: "Provereni lanac promptova koji od transkripta pravi zadatke sa nosiocima i rokovima.", en: "A tested prompt chain that turns transcripts into owners and deadlines." },
    url: "#",
  },
];
