"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { NAV, SKOOL_URL } from "@/lib/config";
import { localePath, stripLocale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";
import LanguageSwitch from "./LanguageSwitch";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  const { locale, t } = useI18n();
  // stripLocale: the server renders "/sr" for the Serbian home page, the browser shows "/".
  const pathname = stripLocale(usePathname());
  const onHome = pathname === "/";
  const home = localePath(locale, "/");
  const prefix = onHome ? "" : home;
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (!onHome) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) setActive(en.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of ["home", ...NAV]) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [onHome]);

  // In-page anchors: lay out all sections first (they're content-visibility:auto
  // with estimated heights), then scroll — otherwise targets land in the wrong place.
  useEffect(() => {
    if (!onHome) return;
    const root = document.documentElement;
    const goTo = (id: string, smooth: boolean) => {
      const el = document.getElementById(id);
      if (!el) return false;
      root.classList.add("cv-off");
      requestAnimationFrame(() => el.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" }));
      return true;
    };
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]');
      if (!a) return;
      const id = a.getAttribute("href")!.split("#")[1];
      if (id && goTo(id, !matchMedia("(prefers-reduced-motion: reduce)").matches)) {
        e.preventDefault();
        history.pushState(null, "", `#${id}`);
      }
    };
    document.addEventListener("click", onClick);
    // Arriving with a hash (e.g. "/#blog" from a post page).
    if (location.hash.length > 1) goTo(decodeURIComponent(location.hash.slice(1)), false);
    return () => document.removeEventListener("click", onClick);
  }, [onHome]);

  // Close the mobile menu on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!shellRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        burgerRef.current?.focus();
      }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = (id: string) => (onHome && active === id ? "true" : undefined);

  return (
    <div className="nav-shell wrap" ref={shellRef}>
      <nav className="nav glass" aria-label={t.nav.label}>
        <Link href={onHome ? "#home" : home} className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span>{profile.brand}</span>
        </Link>
        <ul className="nav-links">
          {NAV.map((id) => (
            <li key={id}>
              <a href={`${prefix}#${id}`} aria-current={current(id)}>
                {t.nav.sections[id]}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <LanguageSwitch />
          <ThemeToggle />
          <a className="btn btn-primary btn-sm nav-cta" href={SKOOL_URL} target="_blank" rel="noopener noreferrer">
            {t.nav.join}
          </a>
          <button
            ref={burgerRef}
            type="button"
            className="icon-btn burger"
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path className="l1" d="M4 8h16" />
              <path className="l2" d="M4 16h16" />
            </svg>
          </button>
        </div>
      </nav>
      <div id="mobile-menu" className={`mobile-menu glass${open ? " open" : ""}`} aria-hidden={!open}>
        {NAV.map((id) => (
          <a key={id} className="item" href={`${prefix}#${id}`} aria-current={current(id)} onClick={() => setOpen(false)}>
            {t.nav.sections[id]}
            <span aria-hidden="true" className="text-muted">›</span>
          </a>
        ))}
        <a className="btn btn-primary" href={SKOOL_URL} target="_blank" rel="noopener noreferrer">
          {t.nav.joinMobile}
        </a>
      </div>
    </div>
  );
}
