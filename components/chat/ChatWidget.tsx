"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../I18nProvider";
import { ChatBubble, Close } from "../icons";

// The chat window (and its portrait, history, streaming code) is loaded lazily.
const ChatWindow = dynamic(() => import("./ChatWindow"), { ssr: false });

/** Floating gradient chat bubble. Preloads the window when the browser is idle or on first interaction. */
export default function ChatWidget() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [load, setLoad] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const warm = () => setLoad(true);
    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(warm, { timeout: 6000 });
      return () => cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 4000);
    return () => clearTimeout(t);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    fabRef.current?.focus();
  }, []);

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        className="chat-fab"
        aria-label={open ? t.chat.closeFab : t.chat.openFab}
        aria-expanded={open}
        aria-controls="chat-window"
        onPointerEnter={() => setLoad(true)}
        onFocus={() => setLoad(true)}
        onClick={() => {
          setLoad(true);
          setOpen((o) => !o);
        }}
      >
        <span className="pulse" aria-hidden="true" />
        {open ? <Close /> : <ChatBubble />}
      </button>
      {load && <ChatWindow open={open} onClose={close} />}
    </>
  );
}
