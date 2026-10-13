"use client";

import { useEffect } from "react";

/**
 * Cursor-following 3D tilt + soft radial glow on [data-tilt] cards (fine pointers
 * only, skipped under prefers-reduced-motion). Delegated from the document, so
 * cards added later by filters work automatically.
 *
 * Scroll reveals and background parallax are pure CSS scroll-driven animations
 * (see globals.css), so nothing here runs on scroll.
 */
export default function MotionEffects() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("motion-on");

    let current: HTMLElement | null = null;
    let raf = 0;
    let last: PointerEvent | null = null;

    const reset = (el: HTMLElement) => {
      el.style.setProperty("--tx", "0deg");
      el.style.setProperty("--ty", "0deg");
    };
    const apply = () => {
      raf = 0;
      const e = last;
      if (!e) return;
      const el = (e.target as Element | null)?.closest?.<HTMLElement>("[data-tilt]") ?? null;
      if (current && current !== el) reset(current);
      current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      if (el.closest(".track")) return; // carousel cards own their transform
      el.style.setProperty("--tx", `${((0.5 - py) * 7).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${((px - 0.5) * 9).toFixed(2)}deg`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeaveDoc = () => {
      if (current) reset(current);
      current = null;
    };

    // Attach after load so we never write styles into markup React is still hydrating.
    const attach = () => {
      document.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeaveDoc);
    };
    if (document.readyState === "complete") attach();
    else addEventListener("load", attach, { once: true });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("load", attach);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeaveDoc);
      document.documentElement.classList.remove("motion-on");
    };
  }, []);

  return null;
}
