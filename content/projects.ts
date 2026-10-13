import type { Project } from "./types";

/**
 * MOCK projects — replace with your real work.
 * Add `image: "/projects/lumen.webp"` (file in /public/projects) to use a
 * screenshot instead of the generated gradient cover.
 */
export const projects: Project[] = [
  { title: "Lumen Tutor", description: "An adaptive AI tutor that adjusts explanations to each learner's pace and misconceptions.", tags: ["Next.js", "LLM API", "pgvector"], year: "2026", url: "#", glyph: "λ" },
  { title: "PromptLab", description: "Open-source workbench for versioning, testing and scoring prompts against eval sets.", tags: ["Python", "FastAPI", "Evals"], year: "2026", url: "#", glyph: "{ }" },
  { title: "Agent Atlas", description: "An interactive map of 40+ agent design patterns, each with a runnable demo.", tags: ["TypeScript", "LangGraph", "D3"], year: "2025", url: "#", glyph: "◎" },
  { title: "DocuMind", description: "Retrieval-augmented Q&A over course material with cited, source-linked answers.", tags: ["RAG", "Qdrant", "LlamaIndex"], year: "2025", url: "#", glyph: "∑" },
  { title: "Voice → Lesson", description: "Turns recorded voice notes into structured lessons, quizzes and flashcards.", tags: ["Speech-to-text", "LLM", "Supabase"], year: "2025", url: "#", glyph: "≋" },
  { title: "ClassPulse", description: "Live sentiment and question clustering for large online cohorts.", tags: ["React", "Embeddings", "WebSockets"], year: "2024", url: "#", glyph: "⌁" },
];
