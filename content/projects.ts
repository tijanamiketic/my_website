import type { Project } from "./types";

/**
 * MOCK projects — replace with your real work.
 * Add `image: "/projects/lumen.webp"` (file in /public/projects) to use a
 * screenshot instead of the generated gradient cover.
 */
export const projects: Project[] = [
  {
    title: "Lumen Tutor",
    description: { sr: "Prilagodljivi AI tutor koji objašnjenja prilagođava tempu i zabludama svakog polaznika.", en: "An adaptive AI tutor that adjusts explanations to each learner's pace and misconceptions." },
    tags: ["Next.js", "LLM API", "pgvector"],
    year: "2026",
    url: "#",
    glyph: "λ",
  },
  {
    title: "PromptLab",
    description: { sr: "Radno okruženje otvorenog koda za verzionisanje, testiranje i ocenjivanje promptova na test-skupovima.", en: "Open-source workbench for versioning, testing and scoring prompts against eval sets." },
    tags: ["Python", "FastAPI", "Evals"],
    year: "2026",
    url: "#",
    glyph: "{ }",
  },
  {
    title: "Agent Atlas",
    description: { sr: "Interaktivna mapa 40+ obrazaca za dizajn agenata, svaki sa demo primerom koji možeš da pokreneš.", en: "An interactive map of 40+ agent design patterns, each with a runnable demo." },
    tags: ["TypeScript", "LangGraph", "D3"],
    year: "2025",
    url: "#",
    glyph: "◎",
  },
  {
    title: "DocuMind",
    description: { sr: "Pitanja i odgovori nad materijalom kursa uz pretragu (RAG), sa odgovorima koji navode i povezuju izvore.", en: "Retrieval-augmented Q&A over course material with cited, source-linked answers." },
    tags: ["RAG", "Qdrant", "LlamaIndex"],
    year: "2025",
    url: "#",
    glyph: "∑",
  },
  {
    title: "Voice → Lesson",
    description: { sr: "Pretvara snimljene glasovne beleške u strukturisane lekcije, kvizove i kartice za učenje.", en: "Turns recorded voice notes into structured lessons, quizzes and flashcards." },
    tags: ["Speech-to-text", "LLM", "Supabase"],
    year: "2025",
    url: "#",
    glyph: "≋",
  },
  {
    title: "ClassPulse",
    description: { sr: "Praćenje raspoloženja i grupisanje pitanja uživo za velike online grupe.", en: "Live sentiment and question clustering for large online cohorts." },
    tags: ["React", "Embeddings", "WebSockets"],
    year: "2024",
    url: "#",
    glyph: "⌁",
  },
];
