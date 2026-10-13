import type { Profile } from "./types";

/**
 * Your profile. Everything about you that appears on the site (and that the
 * chatbot knows) comes from here.
 *
 * PLACEHOLDER values are marked with "TODO" — replace them with your own.
 */
export const profile: Profile = {
  firstName: "Tijana",
  lastName: "Miketić",
  brand: "T. Miketić",
  role: "AI Developer & Educator",
  tagline:
    "I build practical AI products and teach **12,000+ learners** how to design, prompt and ship with language models.",
  status: "Booking workshops for Q4 2026",
  email: "hello@yourdomain.com", // TODO: your real address
  location: "Belgrade, Serbia",
  // Overridden by the NEXT_PUBLIC_SKOOL_URL env var if set.
  skoolUrl: "https://www.skool.com/your-community", // TODO
  stats: [
    { value: "12k+", label: "learners taught" },
    { value: "40+", label: "AI projects shipped" },
    { value: "9", label: "courses & trainings" },
  ],
  badges: [
    { glyph: "AI", title: "Agents 101", subtitle: "New cohort · Oct 8" },
    { glyph: "▶", title: "4.9 / 5", subtitle: "avg. course rating" },
    { glyph: "★", title: "Weekly", subtitle: "AI news digest" },
  ],
  bio: {
    quote: "“The best way to understand AI is to build something small with it — today.”",
    paragraphs: [
      "I'm a developer and educator working at the intersection of language models and learning. For the past six years I've built AI tools for startups and schools, and taught thousands of people — engineers, designers, teachers, founders — how to use them with confidence.",
      "My courses are hands-on and opinionated: fewer buzzwords, more working prototypes. When I'm not teaching, I'm writing about what I learn in production and running live sessions for my community.",
    ],
  },
  pillars: [
    { icon: "code", title: "Build", text: "Agents, RAG systems and AI-powered products, from prototype to production." },
    { icon: "cap", title: "Teach", text: "Courses, cohorts and corporate trainings for technical and non-technical teams." },
    { icon: "spark", title: "Share", text: "Weekly writing, open-source tools and a library of free resources." },
  ],
  newsletter: {
    title: "The Sunday Prompt",
    text: "One email a week: the AI news that matters, one hands-on tutorial, and first access to new courses.",
    perks: ["Free prompt pack on sign-up", "No spam, unsubscribe anytime", "Read by 8,400+ builders"],
  },
  seo: {
    description:
      "AI developer & educator — projects, courses, resources, interviews and live events on building with language models.",
    keywords: ["AI developer", "AI educator", "AI courses", "LLM", "AI agents", "RAG", "prompt engineering"],
  },
};
