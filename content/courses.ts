import type { Course } from "./types";

/**
 * MOCK courses — replace with your real catalogue. All courses are shown as
 * "coming soon" for now, with no price, button or link (see docs/how-to-change.md).
 */
export const courses: Course[] = [
  {
    title: { sr: "AI osnove za 90 minuta", en: "AI Foundations in 90 Minutes" },
    tier: "free",
    level: { sr: "Početni", en: "Beginner" },
    duration: { sr: "1,5 h", en: "1.5 h" },
    description: { sr: "Šta su LLM-ovi, šta ne mogu i kako da počneš da ih koristiš kako treba.", en: "What LLMs are, what they can't do, and how to start using them well." },
    glyph: "01",
  },
  {
    title: { sr: "Promptovi koji zaista rade", en: "Prompting That Actually Works" },
    tier: "free",
    level: { sr: "Početni", en: "Beginner" },
    duration: { sr: "3 h", en: "3 h" },
    description: { sr: "Praktičan okvir za jasne i pouzdane promptove — uz 30 vežbi.", en: "A practical framework for clear, reliable prompts — with 30 exercises." },
    glyph: "✎",
  },
  {
    title: { sr: "Napravi svoju prvu AI aplikaciju", en: "Build Your First AI App" },
    tier: "free",
    level: { sr: "Srednji", en: "Intermediate" },
    duration: { sr: "4 h", en: "4 h" },
    description: { sr: "Napravi i objavi malu AI veb aplikaciju za jedno popodne, bez prethodnog iskustva sa AI-jem.", en: "Ship a small AI web app in an afternoon, no prior AI experience required." },
    glyph: "</>",
  },
  {
    title: { sr: "Masterclass: AI agenti", en: "AI Agents Masterclass" },
    tier: "premium",
    level: { sr: "Napredni", en: "Advanced" },
    duration: { sr: "6 nedelja", en: "6 weeks" },
    price: 349,
    description: { sr: "Dizajniraj, napravi i evaluiraj agente koji koriste alate. Grupa uživo sa pregledom koda.", en: "Design, build and evaluate tool-using agents. Live cohort with code reviews." },
    glyph: "◎",
  },
  {
    title: { sr: "RAG sistemi u produkciji", en: "RAG Systems in Production" },
    tier: "premium",
    level: { sr: "Srednji", en: "Intermediate" },
    duration: { sr: "4 nedelje", en: "4 weeks" },
    price: 249,
    description: { sr: "Deljenje teksta, pretraga, rerangiranje i evaluacija — napravi sistem kome možeš da veruješ.", en: "Chunking, retrieval, reranking and evals — build a system you can trust." },
    glyph: "∑",
  },
  {
    title: { sr: "AI za nastavnike", en: "AI for Educators" },
    tier: "premium",
    level: { sr: "Svi nivoi", en: "All levels" },
    duration: { sr: "3 nedelje", en: "3 weeks" },
    price: 149,
    description: { sr: "Koristi AI za pripremu časova i povratne informacije, i odgovorno uči druge o AI-ju.", en: "Use AI to design lessons, give feedback and teach AI literacy responsibly." },
    glyph: "✦",
  },
];
