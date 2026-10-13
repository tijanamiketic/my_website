import type { Resource } from "./types";

/**
 * MOCK resource library. Put files in /public/resources and reference them as
 * "/resources/<file>", or use an external URL (Google Drive, Notion, GitHub…).
 * The first entry points at a real sample file so you can see the flow.
 */
export const resources: Resource[] = [
  { title: "The Prompt Patterns Handbook", type: "PDF", category: "Prompting", size: "42 pages", updated: "2026-09-10", description: "24 reusable prompt patterns with examples and anti-patterns.", url: "/resources/prompt-patterns-sample.md" },
  { title: "Agent Design Canvas", type: "Template", category: "Agents", size: "Figma + PDF", updated: "2026-09-02", description: "A one-page canvas to plan an agent's goals, tools, memory and guardrails.", url: "#" },
  { title: "RAG Evaluation Checklist", type: "Checklist", category: "RAG", size: "2 pages", updated: "2026-08-28", description: "30 checks for retrieval quality, grounding and citation accuracy.", url: "#" },
  { title: "Starter Notebook: Embeddings", type: "Notebook", category: "RAG", size: "Jupyter", updated: "2026-08-19", description: "Hands-on intro to embeddings, similarity search and clustering.", url: "#" },
  { title: "AI Lesson Plan Template", type: "Template", category: "Teaching", size: "Docs", updated: "2026-08-12", description: "A structured template for AI-assisted lesson design with rubric.", url: "#" },
  { title: "System Prompt Starter Kit", type: "Guide", category: "Prompting", size: "18 pages", updated: "2026-07-30", description: "Annotated system prompts for assistants, tutors and support bots.", url: "#" },
  { title: "Tool-Calling Cheat Sheet", type: "PDF", category: "Agents", size: "4 pages", updated: "2026-07-22", description: "Schemas, error handling and retries for reliable tool use.", url: "#" },
  { title: "Weekly AI Workflow Planner", type: "Template", category: "Productivity", size: "Notion", updated: "2026-07-15", description: "Plan and track the AI workflows that save you the most time.", url: "#" },
  { title: "AI Policy for Classrooms", type: "Guide", category: "Teaching", size: "12 pages", updated: "2026-07-01", description: "A sample AI use policy you can adapt for your school or course.", url: "#" },
  { title: "Meeting Notes → Actions Prompt", type: "Checklist", category: "Productivity", size: "1 page", updated: "2026-06-20", description: "A tested prompt chain that turns transcripts into owners and deadlines.", url: "#" },
];
