import type { NewsItem, NewsSource } from "./types";

/**
 * RSS / Atom feeds for the AI News section. Fetched server-side, merged,
 * de-duplicated and cached for 1 hour. Add or remove feeds freely.
 */
export const newsSources: NewsSource[] = [
  { name: "MIT Tech Review", url: "https://www.technologyreview.com/topic/artificial-intelligence/feed", region: "Americas", topic: "Industry" },
  { name: "The Verge", url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", region: "Americas", topic: "Industry" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/technology-lab", region: "Americas", topic: "Industry", aiOnly: true },
  { name: "Hugging Face", url: "https://huggingface.co/blog/feed.xml", region: "Global", topic: "Open source" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/", region: "Global", topic: "Research" },
  { name: "The Guardian", url: "https://www.theguardian.com/technology/artificialintelligenceai/rss", region: "Europe", topic: "Industry" },
  { name: "Rest of World", url: "https://restofworld.org/feed/latest", region: "Asia", topic: "Industry" },
];

/** Headlines must match this for feeds marked `aiOnly` (general tech feeds). */
export const aiKeywords =
  /\b(AI|A\.I\.|artificial intelligence|LLMs?|GPT|ChatGPT|Claude|Gemini|Llama|machine learning|neural|chatbots?|OpenAI|Anthropic|DeepMind|Mistral|agents?|robots?|deep ?fakes?|language models?)\b/i;

/** How many items to show in the section. */
export const newsLimit = 9;

/**
 * Keyword rules used to assign a topic from a headline. First match wins;
 * otherwise the feed's default topic is used.
 */
export const topicRules: { topic: NewsItem["topic"]; pattern: RegExp }[] = [
  { topic: "Policy", pattern: /\b(regulat|law|act\b|policy|government|senate|congress|eu\b|commission|ban|lawsuit|court|copyright)/i },
  { topic: "Education", pattern: /\b(school|student|teacher|universit|education|classroom|learn(ing)? (tool|platform))/i },
  { topic: "Open source", pattern: /\b(open[- ]source|open[- ]weight|hugging ?face|github|llama|mistral|release[sd]? .* weights)/i },
  { topic: "Research", pattern: /\b(research|paper|benchmark|study|scientist|breakthrough|deepmind|arxiv)/i },
];

/** MOCK fallback shown when every feed fails (e.g. offline builds). */
export const mockNews: NewsItem[] = [
  { source: "Frontier Desk", region: "Global", topic: "Research", date: "2026-10-08T08:10:00Z", title: "New open benchmark aims to measure how well AI agents recover from their own mistakes", url: "#" },
  { source: "EU Tech Brief", region: "Europe", topic: "Policy", date: "2026-10-08T06:30:00Z", title: "Regulators publish draft guidance on transparency labels for AI-generated media", url: "#" },
  { source: "Model Watch", region: "Global", topic: "Industry", date: "2026-10-07T17:45:00Z", title: "Smaller, cheaper models close the gap on coding tasks in latest community evals", url: "#" },
  { source: "Tokyo AI Review", region: "Asia", topic: "Industry", date: "2026-10-07T11:05:00Z", title: "Robotics startups pair vision-language models with warehouse arms at scale", url: "#" },
  { source: "Open Source Weekly", region: "Global", topic: "Open source", date: "2026-10-06T15:20:00Z", title: "Popular inference library adds speculative decoding by default", url: "#" },
  { source: "Signal & Noise", region: "Americas", topic: "Education", date: "2026-10-06T09:00:00Z", title: "Universities expand AI literacy requirements for first-year students", url: "#" },
  { source: "Lagos Tech Post", region: "Africa", topic: "Industry", date: "2026-10-05T07:15:00Z", title: "Local-language speech models reach new accuracy milestone across 12 languages", url: "#" },
];
