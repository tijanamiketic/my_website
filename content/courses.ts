import type { Course } from "./types";

/**
 * MOCK courses — replace with your real catalogue. Every button links to the
 * Skool community (profile.skoolUrl / SKOOL_URL) unless a course sets `url`.
 */
export const courses: Course[] = [
  { title: "AI Foundations in 90 Minutes", tier: "free", level: "Beginner", duration: "1.5 h", description: "What LLMs are, what they can't do, and how to start using them well.", glyph: "01" },
  { title: "Prompting That Actually Works", tier: "free", level: "Beginner", duration: "3 h", description: "A practical framework for clear, reliable prompts — with 30 exercises.", glyph: "✎" },
  { title: "Build Your First AI App", tier: "free", level: "Intermediate", duration: "4 h", description: "Ship a small AI web app in an afternoon, no prior AI experience required.", glyph: "</>" },
  { title: "AI Agents Masterclass", tier: "premium", level: "Advanced", duration: "6 weeks", price: 349, description: "Design, build and evaluate tool-using agents. Live cohort with code reviews.", glyph: "◎" },
  { title: "RAG Systems in Production", tier: "premium", level: "Intermediate", duration: "4 weeks", price: 249, description: "Chunking, retrieval, reranking and evals — build a system you can trust.", glyph: "∑" },
  { title: "AI for Educators", tier: "premium", level: "All levels", duration: "3 weeks", price: 149, description: "Use AI to design lessons, give feedback and teach AI literacy responsibly.", glyph: "✦" },
];
