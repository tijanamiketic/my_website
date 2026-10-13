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
  brand: "T. Miketić",
  role: { sr: "AI razvoj i edukacija", en: "AI Developer & Educator" },
  tagline: {
    sr: "Pravim praktične AI proizvode i učim **12.000+ polaznika** kako da dizajniraju, pišu promptove i lansiraju rešenja sa jezičkim modelima.",
    en: "I build practical AI products and teach **12,000+ learners** how to design, prompt and ship with language models.",
  },
  status: { sr: "Primam prijave za radionice u Q4 2026", en: "Booking workshops for Q4 2026" },
  email: "hello@yourdomain.com", // TODO: your real address
  location: { sr: "Beograd, Srbija", en: "Belgrade, Serbia" },
  // Overridden by the NEXT_PUBLIC_SKOOL_URL env var if set.
  skoolUrl: "https://www.skool.com/your-community", // TODO
  stats: [
    { value: "12k+", label: { sr: "polaznika", en: "learners taught" } },
    { value: "40+", label: { sr: "isporučenih AI projekata", en: "AI projects shipped" } },
    { value: "9", label: { sr: "kurseva i obuka", en: "courses & trainings" } },
  ],
  badges: [
    { glyph: "AI", title: { sr: "Agents 101", en: "Agents 101" }, subtitle: { sr: "Nova grupa · 8. okt", en: "New cohort · Oct 8" } },
    { glyph: "▶", title: { sr: "4,9 / 5", en: "4.9 / 5" }, subtitle: { sr: "prosečna ocena kurseva", en: "avg. course rating" } },
    { glyph: "★", title: { sr: "Nedeljno", en: "Weekly" }, subtitle: { sr: "pregled AI vesti", en: "AI news digest" } },
  ],
  bio: {
    quote: {
      sr: "„Najbolji način da razumeš AI je da danas napraviš nešto malo uz njega.“",
      en: "“The best way to understand AI is to build something small with it — today.”",
    },
    paragraphs: [
      {
        sr: "Razvijam softver i predajem, na preseku jezičkih modela i učenja. Poslednjih šest godina pravim AI alate za startape i škole, a kroz moje obuke prošle su hiljade ljudi — inženjeri, dizajneri, nastavnici, osnivači — koji danas te alate koriste sa samopouzdanjem.",
        en: "I'm a developer and educator working at the intersection of language models and learning. For the past six years I've built AI tools for startups and schools, and taught thousands of people — engineers, designers, teachers, founders — how to use them with confidence.",
      },
      {
        sr: "Moji kursevi su praktični i imaju jasan stav: manje pomodnih reči, više prototipova koji rade. Kad ne predajem, pišem o onome što naučim u produkciji i vodim sesije uživo za svoju zajednicu.",
        en: "My courses are hands-on and opinionated: fewer buzzwords, more working prototypes. When I'm not teaching, I'm writing about what I learn in production and running live sessions for my community.",
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
  newsletter: {
    title: "The Sunday Prompt",
    text: {
      sr: "Jedan imejl nedeljno: AI vesti koje su važne, jedan praktičan tutorijal i prvi pristup novim kursevima.",
      en: "One email a week: the AI news that matters, one hands-on tutorial, and first access to new courses.",
    },
    perks: [
      { sr: "Besplatan paket promptova pri prijavi", en: "Free prompt pack on sign-up" },
      { sr: "Bez spama, odjava u bilo kom trenutku", en: "No spam, unsubscribe anytime" },
      { sr: "Čita ga 8.400+ ljudi koji grade uz AI", en: "Read by 8,400+ builders" },
    ],
  },
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
