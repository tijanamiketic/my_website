import type { Interview } from "./types";

/**
 * Interviews & press. The chatbot reads this file too, so list real appearances only.
 * Mark one item `featured: true` to show it as the large card; its `questions`
 * are listed beside it, each linking to the same piece.
 */
export const interviews: Interview[] = [
  {
    title: { sr: "Ovako sam ja počela", en: "How I got started" },
    outlet: "AK Academy",
    format: "Article",
    date: "2026-03-12",
    quote: { sr: "„AI treba da nam služi, a ne da odlučuje umesto nas.“", en: "“We can't let AI replace our judgment. We need to use AI well.”" },
    questions: [
      { sr: "Ko sam ja?", en: "Who am I?" },
      { sr: "Na koje AI veštine početnici treba prvo da se fokusiraju?", en: "What AI skills should beginners focus on first?" },
      { sr: "Može li AI potpuno da automatizuje moj posao?", en: "Can AI fully automate my work?" },
      { sr: "Sa kojim izazovima sam se suočila na početku?", en: "What were some challenges I faced at the beginning?" },
    ],
    url: "https://ak-academy.ai/interviews/tijana-ai-automation-career",
    featured: true,
  },
];
