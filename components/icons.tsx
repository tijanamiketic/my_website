import type { SVGProps } from "react";
import type { InterviewFormat, Social } from "@/content/types";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const ArrowRight = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const Sun = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
);
export const Moon = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" /></svg>
);
export const Close = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Search = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ChatBubble = (p: P) => (
  <svg {...base} strokeWidth={1.9} {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></svg>
);
export const Pause = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M9 6v12M15 6v12" /></svg>
);
export const Play = (p: P) => (
  <svg {...base} strokeWidth={2} {...p}><path d="M8 5.5v13l10-6.5z" /></svg>
);

const PILLAR: Record<string, React.ReactNode> = {
  code: <path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14" />,
  cap: <><path d="M3 9l9-4 9 4-9 4-9-4Z" /><path d="M7 11v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" /></>,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" />,
};
export const PillarIcon = ({ name, ...p }: P & { name: string }) => (
  <svg {...base} strokeWidth={1.8} {...p}>{PILLAR[name]}</svg>
);

const FORMAT: Record<InterviewFormat, React.ReactNode> = {
  Podcast: <><path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" /><path d="M19 11a7 7 0 0 1-14 0M12 18v3" /></>,
  Video: <><rect x="3" y="6" width="13" height="12" rx="3" /><path d="m16 10 5-3v10l-5-3" /></>,
  Article: <><path d="M6 3h9l4 4v14H6z" /><path d="M9 12h7M9 16h7M9 8h3" /></>,
  Radio: <><rect x="3" y="8" width="18" height="12" rx="3" /><path d="m7 8 9-5" /><circle cx="15" cy="14" r="2.5" /><path d="M7 13h3M7 16h3" /></>,
};
export const FormatIcon = ({ format, ...p }: P & { format: InterviewFormat }) => (
  <svg {...base} strokeWidth={1.8} {...p}>{FORMAT[format]}</svg>
);

const SOCIAL: Record<Social["name"], React.ReactNode> = {
  LinkedIn: <><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" /></>,
  YouTube: <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10.5 9.5 4 2.5-4 2.5z" /></>,
  Instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5v.01" /></>,
  GitHub: <path d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />,
  Skool: <><circle cx="12" cy="12" r="9" /><path d="M15 9.5c-.6-1-1.7-1.5-3-1.5-1.7 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.2-3 2.2-1.4 0-2.6-.6-3.2-1.6" /></>,
};
export const SocialIcon = ({ name, ...p }: P & { name: Social["name"] }) => (
  <svg {...base} strokeWidth={1.8} {...p}>{SOCIAL[name]}</svg>
);
