"use client";

import { useActionState } from "react";
import { subscribe, type NewsletterState } from "@/app/actions/newsletter";

const initial: NewsletterState = { status: "idle", message: "" };

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(subscribe, initial);
  return (
    <>
      <form className="nl-form" action={action} noValidate key={state.status === "ok" ? "done" : "form"}>
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
          aria-invalid={state.status === "error" || undefined}
          aria-describedby="nl-msg"
        />
        {/* honeypot */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      <p id="nl-msg" className={`nl-msg ${state.status === "ok" ? "ok" : state.status === "error" ? "err" : ""}`} role="status">
        {state.message}
      </p>
    </>
  );
}
