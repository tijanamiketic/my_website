"use client";

import { useRef, useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [label, setLabel] = useState("Copy");
  const textRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setLabel("Copied");
    } catch {
      // Clipboard blocked: select the text so the user can copy it manually.
      const range = document.createRange();
      range.selectNodeContents(textRef.current!);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setLabel("Selected — press Ctrl/⌘+C");
    }
    setTimeout(() => setLabel("Copy"), 2200);
  };

  return (
    <div className="email-row">
      <a className="email" href={`mailto:${email}`} ref={textRef}>
        {email}
      </a>
      <button className="btn btn-glass btn-sm" type="button" onClick={copy} aria-label={label === "Copy" ? "Copy email address" : label}>
        {label}
      </button>
      <span className="sr-only" aria-live="polite">
        {label === "Copied" ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
