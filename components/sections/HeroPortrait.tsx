"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import portrait from "@/public/images/portrait.png";
import { profile } from "@/content/profile";
import { fullName } from "@/lib/config";

/**
 * Transparent portrait in front of a frosted-glass arch. The head rises above
 * the arch and the photo is clipped crisply at the arch's rounded bottom
 * (clip-path on .cutout). Mouse-follow 3D tilt + scroll parallax run in one
 * rAF loop that only ticks while the hero is on screen.
 */
export default function HeroPortrait() {
  const portraitRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const portraitEl = portraitRef.current;
    const imgEl = imgWrapRef.current;
    const hero = document.getElementById("home");
    if (!portraitEl || !imgEl || !hero) return;

    let tiltX = 0, tiltY = 0, tgtX = 0, tgtY = 0;
    let raf = 0;
    let visible = true;
    let lastY = -1;

    // Runs only while something is changing (pointer easing or scroll), then sleeps.
    const frame = () => {
      tiltX += (tgtX - tiltX) * 0.08;
      tiltY += (tgtY - tiltY) * 0.08;
      const y = Math.min(scrollY, innerHeight);
      portraitEl.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0) rotateX(${(tiltX + y * 0.012).toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      imgEl.style.transform = `translate3d(${(tiltY * 0.8).toFixed(1)}px, ${(-tiltX * 0.6 - y * 0.03).toFixed(1)}px, 0)`;
      const settled = Math.abs(tgtX - tiltX) < 0.01 && Math.abs(tgtY - tiltY) < 0.01 && y === lastY;
      lastY = y;
      raf = visible && !settled ? requestAnimationFrame(frame) : 0;
    };
    const start = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(hero);
    addEventListener("scroll", start, { passive: true });

    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onMove = (e: PointerEvent) => {
      tgtY = (e.clientX / innerWidth - 0.5) * 14;
      tgtX = (0.5 - e.clientY / innerHeight) * 10;
      start();
    };
    const onLeave = () => {
      tgtX = tgtY = 0;
      start();
    };
    if (fine) {
      hero.addEventListener("pointermove", onMove, { passive: true });
      hero.addEventListener("pointerleave", onLeave);
    }
    start();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("scroll", start);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const [b1, b2, b3] = profile.badges;
  return (
    <div className="portrait-stage">
      <div className="portrait" ref={portraitRef}>
        <div className="halo" aria-hidden="true" />
        <div className="arch glass" aria-hidden="true">
          <div className="orb" />
          <div className="rings" />
        </div>
        <div className="cutout">
          <div ref={imgWrapRef}>
            <Image
              src={portrait}
              alt={`Portrait of ${fullName}`}
              sizes="(max-width: 860px) 78vw, 470px"
              quality={85}
              preload
              fetchPriority="high"
              placeholder="empty"
            />
          </div>
        </div>
        {[b1, b2, b3].map((b, i) => (
          <div key={b.title} className={`float glass f${i + 1}`} aria-hidden="true">
            <span className="ic">{b.glyph}</span>
            <span>
              <b>{b.title}</b>
              <small>{b.subtitle}</small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
