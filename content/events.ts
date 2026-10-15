import type { EventItem } from "./types";

/**
 * MOCK events. Times are CET. Past events are hidden automatically.
 */
export const events: EventItem[] = [
  {
    title: { sr: "AI u učionici — radionica", en: "AI in the Classroom — Workshop" },
    date: "2026-10-22",
    time: "10:00–13:00",
    mode: "In person",
    location: { sr: "Beograd · Naučno-tehnološki park", en: "Belgrade · Science Park" },
    description: { sr: "Praktična radionica za nastavnike: priprema časova, povratne informacije i pravila za korišćenje AI-ja.", en: "Hands-on workshop for teachers: lesson design, feedback and AI policy." },
    seats: 12,
    url: "#",
  },
  {
    title: { sr: "Pravimo zajedno: RAG za jedno veče", en: "Build-along: RAG in One Evening" },
    date: "2026-11-05",
    time: "19:00–21:00",
    mode: "Online",
    location: { sr: "YouTube Live", en: "YouTube Live" },
    description: { sr: "Zajedno od nule pišemo malu aplikaciju za pretragu — pitanja su dobrodošla.", en: "Code a small retrieval app together from scratch, questions welcome." },
    seats: null,
    url: "#",
  },
  {
    title: { sr: "Masterclass: AI agenti — početak zimske grupe", en: "Agents Masterclass — Winter Cohort Kickoff" },
    date: "2026-11-19",
    time: "18:00–19:30",
    mode: "Online",
    location: { sr: "Zoom", en: "Zoom" },
    description: { sr: "Uvodna sesija Masterclass-a o agentima. Prvi sat je otvoren za sve.", en: "Opening session of the Agents Masterclass. Open to everyone for the first hour." },
    seats: 48,
    url: "#",
  },
  {
    title: { sr: "AI Builders Meetup — zimsko izdanje", en: "AI Builders Meetup — Winter Edition" },
    date: "2026-12-03",
    time: "18:30–21:00",
    mode: "In person",
    location: { sr: "Milano · Talent Garden", en: "Milan · Talent Garden" },
    description: { sr: "Kratka predavanja iz zajednice, demonstracije i umrežavanje.", en: "Lightning talks from the community, demos and networking." },
    seats: 30,
    url: "#",
  },
];
