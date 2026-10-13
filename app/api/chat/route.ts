import Anthropic from "@anthropic-ai/sdk";
import { dictionaries, type Dictionary } from "@/content/i18n";
import { toLocale } from "@/lib/i18n";
import { buildSystemPrompt } from "@/lib/chat-context";
import { mockReply } from "@/lib/mock-chat";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const MAX_MESSAGES = 20; // conversation turns sent per request
const MAX_CHARS = 1000; // per user message
const MAX_TOTAL_CHARS = 12_000;

// Claude Opus 5 by default; set ANTHROPIC_MODEL to e.g. "claude-haiku-4-5" for a cheaper bot.
const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";
// Server-side refusal fallback is supported on the Opus 5 / Fable tier.
const SUPPORTS_FALLBACK = /^claude-(opus-5|fable-5)/.test(MODEL);

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseBody(body: unknown, t: Dictionary["chat"]): ChatMessage[] | string {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return t.invalidRequest;
  const messages = raw.slice(-MAX_MESSAGES).map((m) => ({
    role: (m as ChatMessage)?.role,
    content: typeof (m as ChatMessage)?.content === "string" ? (m as ChatMessage).content.trim() : "",
  }));
  if (messages.some((m) => (m.role !== "user" && m.role !== "assistant") || !m.content)) return t.invalidRequest;
  if (messages.some((m) => m.role === "user" && m.content.length > MAX_CHARS)) return t.tooLong(MAX_CHARS);
  if (messages.reduce((n, m) => n + m.content.length, 0) > MAX_TOTAL_CHARS) return t.conversationTooLong;
  // The API needs the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.at(-1)?.role !== "user") return t.invalidRequest;
  return messages as ChatMessage[];
}

function textStream(produce: (write: (s: string) => void) => Promise<void>, mode: "ai" | "mock", t: Dictionary["chat"]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await produce((s) => controller.enqueue(encoder.encode(s)));
      } catch (err) {
        console.error("[chat] stream error:", err);
        controller.enqueue(encoder.encode(`\n\n${t.lostConnection}`));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Chat-Mode": mode },
  });
}

/** Stream a canned answer in small chunks so the UI behaves the same in both modes. */
async function streamMock(text: string, write: (s: string) => void) {
  await new Promise((r) => setTimeout(r, 350));
  for (const chunk of text.match(/.{1,12}(\s|$)|.+/g) ?? [text]) {
    write(chunk);
    await new Promise((r) => setTimeout(r, 18));
  }
}

export async function POST(req: Request) {
  // Route Handlers can't read the [lang] route segment, so the widget sends ?lang=.
  const locale = toLocale(new URL(req.url).searchParams.get("lang"));
  const t = dictionaries[locale].chat;
  const ip = clientKey(req.headers);
  const burst = rateLimit(`chat-burst:${ip}`, 5, 10_000);
  const hourly = rateLimit(`chat:${ip}`, 40, 60 * 60_000);
  if (!burst.ok || !hourly.ok) {
    const retryAfter = Math.max(burst.retryAfter, hourly.retryAfter);
    return Response.json({ error: t.tooFast }, { status: 429, headers: { "Retry-After": String(retryAfter) } });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: t.invalidRequest }, { status: 400 });
  }
  const messages = parseBody(body, t);
  if (typeof messages === "string") return Response.json({ error: messages }, { status: 400 });
  const question = messages.at(-1)!.content;

  if (!process.env.ANTHROPIC_API_KEY) {
    const answer = await mockReply(question, locale);
    return textStream((write) => streamMock(answer, write), "mock", t);
  }

  const client = new Anthropic();
  const system = await buildSystemPrompt(locale);

  return textStream(async (write) => {
    let wrote = false;
    try {
      const stream = client.beta.messages.stream(
        {
          model: MODEL,
          max_tokens: 2048,
          // Stable system prompt first, marked for caching: repeat visitors reuse it cheaply.
          system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
          messages,
          // Short FAQ-style answers don't need deep reasoning.
          output_config: { effort: "low" },
          ...(SUPPORTS_FALLBACK ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const } : {}),
        },
        { signal: req.signal },
      );
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          write(event.delta.text);
          wrote = true;
        }
      }
      const final = await stream.finalMessage();
      if (final.stop_reason === "refusal" && !wrote) {
        write(t.refusal);
      } else if (!wrote) {
        write(await mockReply(question, locale));
      }
    } catch (err) {
      if (req.signal.aborted) return;
      // Typed SDK errors: fall back to the local responder so the widget never dead-ends.
      if (err instanceof Anthropic.RateLimitError) console.warn("[chat] Anthropic rate limit hit");
      else if (err instanceof Anthropic.AuthenticationError) console.error("[chat] invalid ANTHROPIC_API_KEY");
      else if (err instanceof Anthropic.APIError) console.error(`[chat] Anthropic API error ${err.status}:`, err.message);
      else throw err;
      write(wrote ? `\n\n${t.interrupted}` : await mockReply(question, locale));
    }
  }, "ai", t);
}
