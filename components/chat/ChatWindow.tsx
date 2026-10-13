"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import portrait from "@/public/images/portrait.png";
import { profile } from "@/content/profile";
import { ArrowRight, Close } from "../icons";

type Msg = { role: "user" | "assistant"; content: string; error?: boolean };

const QUICK = ["Free courses", "Next event", "Interviews", "Course prices", "Latest article", "How to contact?"];
const MAX_CHARS = 1000;
const STORAGE_KEY = "chat-history-v1";
const GREETING: Msg = {
  role: "assistant",
  content: `Hi 👋 I'm ${profile.firstName}'s assistant. Ask me about courses, events, interviews or resources.`,
};

/** Turn bare URLs and email addresses into links; everything else stays plain text (no HTML injection). */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/((?:https?:\/\/|\/blog\/)[^\s)]+[^\s).,!?;:]|[\w.+-]+@[\w-]+\.[\w.-]+[a-z])/gi);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
        const isEmail = p.includes("@") && !p.startsWith("http");
        const href = isEmail ? `mailto:${p}` : p;
        const external = /^https?:/.test(p) && !p.startsWith(typeof location !== "undefined" ? location.origin : "~");
        return (
          <a key={i} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {p.replace(/^https?:\/\/(www\.)?/, "")}
          </a>
        );
      })}
    </>
  );
}

function loadHistory(): Msg[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Msg[];
  } catch {}
  return [GREETING];
}

/**
 * The chat window itself. Loaded lazily (client-only) by ChatWidget, so its code
 * never delays the first paint. History is kept per browser tab in sessionStorage.
 */
export default function ChatWindow({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>(loadHistory);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (busy) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {}
  }, [messages, busy]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, waiting, open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  async function ask(text: string) {
    const q = text.trim().slice(0, MAX_CHARS);
    if (!q || busy) return;
    const history: Msg[] = [...messages.filter((m) => !m.error), { role: "user", content: q }];
    setMessages([...messages, { role: "user", content: q }]);
    setInput("");
    setBusy(true);
    setWaiting(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-20).map(({ role, content }) => ({ role, content })) }),
      });
      if (!res.ok || !res.body) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error || "I couldn't reach the assistant just now. Please try again in a moment.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        reply += decoder.decode(value, { stream: true });
        setWaiting(false);
        setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: reply }]);
      }
      if (!reply.trim()) setMessages((m) => [...m.slice(0, -1), { role: "assistant", content: "Sorry, I didn't catch that — could you rephrase?", error: true }]);
    } catch (e) {
      setMessages((m) => [...m.filter((x) => x.content !== "" || x.role !== "assistant"), { role: "assistant", content: (e as Error).message, error: true }]);
    } finally {
      setBusy(false);
      setWaiting(false);
    }
  }

  return (
      <div id="chat-window" className={`chat glass${open ? " open" : ""}`} role="dialog" aria-labelledby="chat-title" aria-hidden={!open}>
        <div className="chat-head">
          <Image src={portrait} alt="" width={38} height={38} sizes="38px" />
          <div>
            <b id="chat-title">Ask {profile.brand}</b>
            <small>
              <i aria-hidden="true" />
              Assistant · usually instant
            </small>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close chat"
            onClick={onClose}
          >
            <Close />
          </button>
        </div>

        <div className="msgs" ref={listRef} role="log" aria-live="polite" aria-busy={busy}>
          {messages.map((m, i) =>
            m.role === "assistant" && m.content === "" ? null : (
              <div key={i} className={`msg ${m.role === "user" ? "me" : "bot"}${m.error ? " err" : ""}`}>
                <span className="sr-only">{m.role === "user" ? "You: " : "Assistant: "}</span>
                {m.role === "assistant" ? <Linkified text={m.content} /> : m.content}
              </div>
            ),
          )}
          {waiting && (
            <div className="msg bot" style={{ padding: 0 }} aria-label="Assistant is typing">
              <span className="typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </div>
          )}
        </div>

        <div className="quick" role="group" aria-label="Suggested questions">
          {QUICK.map((q) => (
            <button key={q} type="button" onClick={() => ask(q)} disabled={busy}>
              {q}
            </button>
          ))}
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            ask(input);
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, events…"
            autoComplete="off"
            maxLength={MAX_CHARS}
            enterKeyHint="send"
          />
          <button type="submit" aria-label="Send message" disabled={busy || !input.trim()}>
            <ArrowRight />
          </button>
        </form>
      </div>
  );
}
