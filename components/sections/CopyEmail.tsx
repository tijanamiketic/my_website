"use client";

import { useRef, useState } from "react";
import { useI18n } from "../I18nProvider";

export default function CopyEmail({ email }: { email: string }) {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const label = state === "copied" ? t.contact.copied : state === "selected" ? t.contact.selected : t.contact.copy;
  const textRef = useRef<HTMLAnchorElement>(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      // Clipboard blocked: select the text so the user can copy it manually.
      const range = document.createRange();
      range.selectNodeContents(textRef.current!);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      setState("selected");
    }
    setTimeout(() => setState("idle"), 2200);
  };

  return (
    <div className="email-row">
      <a className="email" href={`mailto:${email}`} ref={textRef}>
        {email}
      </a>
      <button className="btn btn-glass btn-sm" type="button" onClick={copy} aria-label={state === "idle" ? t.contact.copyAria : label}>
        {label}
      </button>
      <span className="sr-only" aria-live="polite">
        {state === "copied" ? t.contact.copiedAnnounce : ""}
      </span>
    </div>
  );
}
