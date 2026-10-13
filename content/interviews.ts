import type { Interview } from "./types";

/**
 * MOCK interviews & press — replace with real appearances.
 * Mark one item `featured: true` to show it as the large card.
 */
export const interviews: Interview[] = [
  {
    title: { sr: "Kako podučavati AI ljude koji ga se plaše", en: "How to teach AI to people who are afraid of it" },
    outlet: "The Build Podcast",
    format: "Podcast",
    date: "2026-09-12",
    duration: { sr: "58 min", en: "58 min" },
    quote: { sr: "„Samopouzdanje dolazi kad napraviš jednu malu stvar koja radi.“", en: "“Confidence comes from building one small thing that works.”" },
    url: "#",
    featured: true,
  },
  {
    title: { sr: "Budućnost AI-ja u evropskim učionicama", en: "The future of AI in European classrooms" },
    outlet: "EdTech Voices",
    format: "Video",
    date: "2026-08-26",
    duration: { sr: "32 min", en: "32 min" },
    url: "#",
  },
  {
    title: { sr: "Od programiranja do podučavanja: karijera građena javno", en: "From developer to educator: a career built in public" },
    outlet: "Adriatic Tech Weekly",
    format: "Article",
    date: "2026-07-30",
    duration: { sr: "8 min čitanja", en: "8 min read" },
    url: "#",
  },
  {
    title: { sr: "Agenti, hajp i ono što je zaista korisno", en: "Agents, hype and what's actually useful" },
    outlet: "Signal Talks",
    format: "Podcast",
    date: "2026-06-18",
    duration: { sr: "44 min", en: "44 min" },
    url: "#",
  },
  {
    title: { sr: "Jutarnji tehnološki segment: AI alati za mala preduzeća", en: "Morning tech segment: AI tools for small businesses" },
    outlet: "City Radio 202",
    format: "Radio",
    date: "2026-05-09",
    duration: { sr: "15 min", en: "15 min" },
    url: "#",
  },
];
