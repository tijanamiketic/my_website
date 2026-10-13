import type { EventItem } from "./types";

/**
 * MOCK events. Times are CET. Past events are hidden automatically.
 */
export const events: EventItem[] = [
  { title: "AI in the Classroom — Workshop", date: "2026-10-22", time: "10:00–13:00", mode: "In person", location: "Belgrade · Science Park", description: "Hands-on workshop for teachers: lesson design, feedback and AI policy.", seats: 12, url: "#" },
  { title: "Build-along: RAG in One Evening", date: "2026-11-05", time: "19:00–21:00", mode: "Online", location: "YouTube Live", description: "Code a small retrieval app together from scratch, questions welcome.", seats: null, url: "#" },
  { title: "Agents Masterclass — Winter Cohort Kickoff", date: "2026-11-19", time: "18:00–19:30", mode: "Online", location: "Zoom", description: "Opening session of the Agents Masterclass. Open to everyone for the first hour.", seats: 48, url: "https://www.skool.com/your-community" },
  { title: "AI Builders Meetup — Winter Edition", date: "2026-12-03", time: "18:30–21:00", mode: "In person", location: "Milan · Talent Garden", description: "Lightning talks from the community, demos and networking.", seats: 30, url: "#" },
];
