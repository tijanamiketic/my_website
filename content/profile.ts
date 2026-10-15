import type { Profile } from "./types";

/**
 * Your profile. Everything about you that appears on the site (and that the
 * chatbot knows) comes from here. Text fields have a Serbian (sr) and an English (en) version.
 *
 * PLACEHOLDER values are marked with "TODO" — replace them with your own.
 */
export const profile: Profile = {
  firstName: "Tijana",
  lastName: "Miketić",
  brand: "Tijana Miketić",
  role: { sr: "AI Specijalista i Edukator", en: "AI Specialist & Educator" },
  tagline: {
    sr: "Pravim praktične AI proizvode, svakodnevno istražujem svet veštačke inteligencije i delim znanje, savete i iskustva koja zaista možeš da primeniš.",
    en: "I build practical AI products, explore the world of AI every day, and share knowledge, tips and lessons you can actually put to use.",
  },
  status: { sr: "Primam prijave za konsultacije", en: "Now booking consultations" },
  email: "tijanamiketic.raz@gmail.com",
  location: { sr: "Beograd, Srbija", en: "Belgrade, Serbia" },
  // Overridden by the NEXT_PUBLIC_SKOOL_URL env var if set.
  skoolUrl: "https://www.skool.com/your-community", // TODO
  stats: [{ value: "9", label: { sr: "kurseva i obuka", en: "courses & trainings" } }],
  bio: {
    quote: {
      sr: "„Najbolji način da razumeš AI je da danas napraviš nešto malo uz njega.“",
      en: "“The best way to understand AI is to build something small with it — today.”",
    },
    paragraphs: [
      {
        sr: "Već nekoliko godina istražujem veštačku inteligenciju i njenu primenu u praksi. Uočavam procese koji mogu da se automatizuju, razvijam AI alate i svakodnevno učim, a ono što naučim delim sa drugima. Probleme rešavam nekoliko koraka unapred: i one koji već postoje, i one koji tek mogu da nastanu.",
        en: "For several years I’ve been researching artificial intelligence and how to apply it in practice. I spot processes that can be automated, build AI tools, and learn every day, then share what I learn with others. I solve problems a few steps ahead: the ones that already exist, and the ones that haven’t appeared yet.",
      },
      {
        sr: "Moji kursevi nisu klasična škola. To je lično i primenljivo znanje, nastalo na mom putu od nule do onoga što danas radim.",
        en: "My courses aren’t a traditional school. They’re personal, practical knowledge, built on my own journey from zero to what I do today.",
      },
    ],
  },
  pillars: [
    {
      icon: "code",
      title: { sr: "Gradim", en: "Build" },
      text: { sr: "Agenti, RAG sistemi i AI proizvodi, od prototipa do produkcije.", en: "Agents, RAG systems and AI-powered products, from prototype to production." },
    },
    {
      icon: "cap",
      title: { sr: "Predajem", en: "Teach" },
      text: { sr: "Kursevi, grupni programi i korporativne obuke za tehničke i netehničke timove.", en: "Courses, cohorts and corporate trainings for technical and non-technical teams." },
    },
    {
      icon: "spark",
      title: { sr: "Delim", en: "Share" },
      text: { sr: "Tekstovi svake nedelje, alati otvorenog koda i biblioteka besplatnih resursa.", en: "Weekly writing, open-source tools and a library of free resources." },
    },
  ],
  seo: {
    description: {
      sr: "AI razvoj i edukacija — projekti, kursevi, resursi, intervjui i događaji uživo o radu sa jezičkim modelima.",
      en: "AI developer & educator — projects, courses, resources, interviews and live events on building with language models.",
    },
    keywords: [
      { sr: "AI razvoj", en: "AI developer" },
      { sr: "AI edukacija", en: "AI educator" },
      { sr: "AI kursevi", en: "AI courses" },
      { sr: "LLM", en: "LLM" },
      { sr: "AI agenti", en: "AI agents" },
      { sr: "RAG", en: "RAG" },
      { sr: "prompt inženjering", en: "prompt engineering" },
    ],
  },
};
