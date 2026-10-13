"use server";

import { headers } from "next/headers";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export type NewsletterState = { status: "idle" | "ok" | "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function subscribe(_prev: NewsletterState, form: FormData): Promise<NewsletterState> {
  // Honeypot: real users never fill this hidden field.
  if (String(form.get("company") ?? "")) return { status: "ok", message: "Thanks!" };

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return { status: "error", message: "Enter a valid email address, like name@example.com." };
  }

  const limit = rateLimit(`nl:${clientKey(await headers())}`, 5, 10 * 60_000);
  if (!limit.ok) return { status: "error", message: "Too many attempts — please try again in a few minutes." };

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhook) {
    // TODO: connect your newsletter provider. Either set NEWSLETTER_WEBHOOK_URL
    // (Zapier / Make / n8n / Kit form endpoint that accepts JSON { email }), or
    // replace this block with a direct API call, e.g. Buttondown:
    //   await fetch("https://api.buttondown.com/v1/subscribers", {
    //     method: "POST",
    //     headers: { Authorization: `Token ${process.env.NEWSLETTER_API_KEY}`, "Content-Type": "application/json" },
    //     body: JSON.stringify({ email_address: email }),
    //   });
    console.info("[newsletter] NEWSLETTER_WEBHOOK_URL not set — demo mode, nothing was sent for", email);
    return { status: "ok", message: `You're on the list — check ${email} for the welcome email. (Demo mode: nothing was sent.)` };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.NEWSLETTER_API_KEY ? { Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}` } : {}),
      },
      body: JSON.stringify({ email, source: "website" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "ok", message: `You're on the list — check ${email} for the welcome email.` };
  } catch (err) {
    console.error("[newsletter] subscribe failed:", err);
    return { status: "error", message: "Something went wrong on our side. Please try again later." };
  }
}
