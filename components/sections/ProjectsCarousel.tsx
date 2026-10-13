"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Project } from "@/content/types";
import { ArrowLeft, ArrowRight, Pause, Play } from "../icons";
import { Cover } from "../ui";

const SPEED = 38; // px per second
const DECAY = 0.04; // fraction of momentum left after 1s
const K = -Math.log(DECAY); // so a velocity v glides v / K px in total
const noopSubscribe = () => () => {};

function ProjectCard({ p, clone }: { p: Project; clone?: boolean }) {
  return (
    <article className="project glass" data-tilt aria-hidden={clone || undefined} inert={clone || undefined}>
      <Cover title={p.title} image={p.image} glyph={p.glyph} sizes="370px" />
      <div className="body">
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <ul className="chips" aria-label="Tech stack">
          {p.tags.map((t) => (
            <li key={t} className="chip">{t}</li>
          ))}
        </ul>
        <div className="row">
          <span className="mono year">{p.year}</span>
          <a className="link-arrow" href={p.url} aria-label={`View project: ${p.title}`}>
            View project <ArrowRight />
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Infinite auto-scrolling coverflow carousel.
 * - Pauses on hover, keyboard focus, when off-screen, or via the pause button.
 * - Mouse drag / touch swipe with momentum; arrow keys and prev/next buttons glide by one card.
 * - prefers-reduced-motion: no autoplay, falls back to a native swipeable row with scroll-snap.
 */
export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState(false);
  // The duplicate set that makes the loop seamless is client-only: it keeps six
  // heavy cards out of the server HTML and the first layout pass.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [userPaused, setUserPaused] = useState(false);
  const pausedRef = useRef(false);
  const nudgeRef = useRef<(dir: 1 | -1) => void>(() => {});

  useEffect(() => {
    pausedRef.current = userPaused;
  }, [userPaused]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced || !hydrated) return;
    const vp = vpRef.current!;
    const track = trackRef.current!;
    const cards = Array.from(track.children) as HTMLElement[];
    let x = 0, half = 0, cw = 0, vw = 0, step = 0;
    let offsets: number[] = [];
    let hovering = false, focused = false, dragging = false, visible = true;
    let startX = 0, startPos = 0, moved = 0, vel = 0, lastX = 0, lastT = 0, pointerId = -1;

    const measure = () => {
      half = track.scrollWidth / 2;
      offsets = cards.map((c) => c.offsetLeft);
      cw = cards[0]?.offsetWidth ?? 0;
      vw = vp.clientWidth;
      step = cw + 20;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(vp);

    nudgeRef.current = (dir) => {
      vel = -dir * step * K;
    };

    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    const onFocusIn = (e: FocusEvent) => {
      focused = true;
      // Bring the focused card fully into view.
      const card = (e.target as HTMLElement).closest<HTMLElement>(".project");
      if (!card) return;
      const left = card.offsetLeft + x;
      if (left < 24) x += 24 - left;
      else if (left + cw > vw - 24) x -= left + cw - (vw - 24);
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!vp.contains(e.relatedTarget as Node)) focused = false;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      moved = 0;
      vel = 0;
      startX = lastX = e.clientX;
      startPos = x;
      lastT = performance.now();
      pointerId = e.pointerId;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 6 && !vp.classList.contains("dragging")) {
        vp.classList.add("dragging");
        try {
          vp.setPointerCapture(e.pointerId);
        } catch {}
      }
      const now = performance.now();
      vel = ((e.clientX - lastX) / Math.max(1, now - lastT)) * 1000;
      lastX = e.clientX;
      lastT = now;
      x = startPos + dx;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - lastT > 80) vel = 0; // held still before release: no fling
      setTimeout(() => vp.classList.remove("dragging"), 0);
    };
    const onClickCapture = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nudgeRef.current(1);
      else if (e.key === "ArrowLeft") nudgeRef.current(-1);
      else return;
      e.preventDefault();
    };

    vp.addEventListener("mouseenter", onEnter);
    vp.addEventListener("mouseleave", onLeave);
    vp.addEventListener("focusin", onFocusIn);
    vp.addEventListener("focusout", onFocusOut);
    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("keydown", onKey);
    vp.addEventListener("click", onClickCapture, true);
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerup", onUp);
    addEventListener("pointercancel", onUp);

    let raf = 0;
    let prev = performance.now();
    const frame = (now: number) => {
      const dt = Math.min(64, now - prev) / 1000;
      prev = now;
      if (!dragging) {
        if (Math.abs(vel) > 5) {
          x += vel * dt;
          vel *= Math.pow(DECAY, dt);
        } else if (!hovering && !focused && !pausedRef.current) {
          x -= SPEED * dt;
        }
      }
      if (half > 0) {
        while (x <= -half) { x += half; startPos += half; }
        while (x > 0) { x -= half; startPos -= half; }
      }
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      // Coverflow depth: cards rotate toward the centre of the viewport.
      const center = vw / 2;
      for (let i = 0; i < cards.length; i++) {
        const c = offsets[i] + x + cw / 2 + 10;
        if (c < -cw || c > vw + cw) continue;
        const d = Math.min(1, Math.max(-1, (c - center) / vw));
        cards[i].style.transform = `rotateY(${(-d * 18).toFixed(2)}deg) translateZ(${(-Math.abs(d) * 90).toFixed(1)}px)`;
        cards[i].style.opacity = (1 - Math.abs(d) * 0.35).toFixed(3);
      }
      raf = visible ? requestAnimationFrame(frame) : 0;
    };
    function start() {
      if (!raf) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      vp.removeEventListener("mouseenter", onEnter);
      vp.removeEventListener("mouseleave", onLeave);
      vp.removeEventListener("focusin", onFocusIn);
      vp.removeEventListener("focusout", onFocusOut);
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("keydown", onKey);
      vp.removeEventListener("click", onClickCapture, true);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      removeEventListener("pointercancel", onUp);
      track.style.transform = "";
      for (const c of cards) {
        c.style.transform = "";
        c.style.opacity = "";
      }
    };
  }, [reduced, hydrated]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Projects">
      {!reduced && (
        <div className="wrap marquee-ctrl" style={{ justifyContent: "flex-end", marginBottom: "-.5rem" }}>
          <button type="button" className="icon-btn" aria-label="Previous project" onClick={() => nudgeRef.current(-1)}>
            <ArrowLeft />
          </button>
          <button type="button" className="icon-btn" aria-label={userPaused ? "Play carousel" : "Pause carousel"} aria-pressed={userPaused} onClick={() => setUserPaused((p) => !p)}>
            {userPaused ? <Play /> : <Pause />}
          </button>
          <button type="button" className="icon-btn" aria-label="Next project" onClick={() => nudgeRef.current(1)}>
            <ArrowRight />
          </button>
        </div>
      )}
      <div ref={vpRef} className={`marquee${reduced ? " static" : ""}`}>
        <div ref={trackRef} className="track">
          {projects.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
          {hydrated && !reduced && projects.map((p) => <ProjectCard key={`${p.title}-clone`} p={p} clone />)}
        </div>
      </div>
    </div>
  );
}
