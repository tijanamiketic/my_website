"use client";

import { Moon, Sun } from "./icons";

function isDark() {
  const t = document.documentElement.dataset.theme;
  return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Follows the system theme until the user picks one; the choice is saved in
 * localStorage and applied before first paint by the script in app/layout.tsx.
 * Both icons are rendered and CSS shows the right one, so SSR markup never mismatches.
 */
export default function ThemeToggle() {
  const toggle = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };
  return (
    <button type="button" className="icon-btn theme-btn" onClick={toggle} aria-label="Toggle light or dark mode" title="Toggle theme">
      <Moon className="i-moon" />
      <Sun className="i-sun" />
    </button>
  );
}
