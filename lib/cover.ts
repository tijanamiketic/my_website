/**
 * Deterministic pastel gradients, so items without an image still get a
 * distinctive cover / icon colour derived from their title.
 */
const PALETTE = ["#A9B8F5", "#C7B3F5", "#F4BFD5", "#B7D3F0", "#D5DAE4", "#9FB0DE", "#E6C6E4", "#BFD0F2"];

export function hash(s: string): number {
  let h = 7;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

export const pick = (seed: number, i: number) => PALETTE[(seed + i * 3) % PALETTE.length];

export function coverGradient(title: string): string {
  const s = hash(title);
  const [a, b, c, d] = [pick(s, 0), pick(s, 1), pick(s, 2), pick(s, 3)];
  const x1 = 15 + (s % 40), y1 = 20 + ((s >> 3) % 50), x2 = 60 + ((s >> 5) % 30), y2 = 55 + ((s >> 7) % 35);
  return `radial-gradient(at ${x1}% ${y1}%, ${a} 0, transparent 55%), radial-gradient(at ${x2}% ${y2}%, ${b} 0, transparent 50%), linear-gradient(${(s % 180) + 100}deg, ${c}, ${d})`;
}

export function iconGradient(title: string): string {
  const s = hash(title);
  return `linear-gradient(135deg, ${pick(s, 0)}, ${pick(s, 2)})`;
}
