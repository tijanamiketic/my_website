# AI: the chat assistant

The site has a chat widget (bottom corner) that answers visitors' questions about courses, events, interviews, resources, projects, blog posts and how to get in touch.

Request flow: `components/chat/ChatWindow.tsx` → `POST /api/chat` (`app/api/chat/route.ts`) → Claude, streamed back as plain text. If there is no API key or the API fails, `lib/mock-chat.ts` answers instead. The response header `X-Chat-Mode` says which one answered (`ai` or `mock`).

## Prompts

There is one prompt: the system prompt, built by `buildSystemPrompt()` in `lib/chat-context.ts`. It is not stored as text; it is generated on each request from the files in `content/`.

It has two parts:

1. **Instructions:** keep replies to 1–4 sentences, plain text only (the widget does not render markdown, but turns bare URLs and emails into links), answer only from the facts given, never invent courses, prices, dates or links, say "I don't know" and point to the contact email when unsure, speak about Tijana in the third person, reply in the visitor's language, and decline unrelated tasks.
2. **Facts:** sections in XML-style tags (`<profile>`, `<courses>`, `<upcoming_events>`, `<interviews_and_press>`, `<free_resources>`, `<projects>`, `<blog_posts>`), built from `content/` and the blog folder.

Why it is written this way:

- **Generated from content:** the assistant always knows the current courses, prices and events, and there is no second copy of the facts to keep in sync.
- **Strict "only from the facts" rules:** the assistant speaks for a real person, so a made-up price or date is worse than "I don't know".
- **Byte-stable:** the prompt contains no timestamps or random values, so Anthropic prompt caching can reuse it across visitors (`cache_control: ephemeral`). The list of upcoming events only changes when the hourly cache in `lib/events.ts` refreshes.
- **Placeholder links (`"#"`)** are replaced with hints like "the Register button in the Events section", so the assistant never gives out a dead link.

Request limits (in `app/api/chat/route.ts`): the last 20 messages, 1,000 characters per user message, 12,000 characters in total, `max_tokens` 2048. Rate limits per IP: 5 requests per 10 seconds and 40 per hour.

## Model

- **Default:** `claude-opus-5`, set in `app/api/chat/route.ts`. Override with the `ANTHROPIC_MODEL` env variable; the code suggests `claude-haiku-4-5` for a cheaper bot.
- **Settings:** `effort: "low"` (short FAQ-style answers need little reasoning). On Opus 5 / Fable 5 models the server-side refusal fallback beta is turned on.
- **Why this model:** TODO: confirm with owner. Cost per conversation has not been measured.

## Fallback responder

`lib/mock-chat.ts` matches the visitor's message against keyword lists (English plus a few Serbian words, e.g. "besplat", "kurs", "kontakt") and answers from the same `content/` data. It is used when:

- `ANTHROPIC_API_KEY` is not set,
- the Anthropic API returns an error (rate limit, bad key, outage) before any text was sent,
- Claude returns no text.

## Evaluation

There is no automated evaluation. TODO: confirm with owner.

Manual check, after changing the prompt, model or content:

1. Run `npm run dev` with `ANTHROPIC_API_KEY` set in `.env.local`.
2. Open the chat and click each quick-reply button (Free courses, Next event, Interviews, Course prices, Latest article, How to contact?). Check every answer against `content/`.
3. Ask something not covered (e.g. "Is Tijana free on 3 March?"). It should say it doesn't know and give the email.
4. Ask something off-topic (e.g. "Write my homework"). It should decline politely.
5. Ask in Serbian. It should answer in Serbian.
6. Remove the API key, restart, and repeat step 2 to check the fallback.

## Limitations

- Knows only what is in `content/` and the blog post titles. It does not read the bodies of blog posts.
- The fallback responder is keyword-based: it misses rephrased questions and always picks the first matching topic.
- Rate limits are per server instance, not global (see [decisions.md](decisions.md)).
- Chat history is kept per browser tab in `sessionStorage` and is never stored on the server.
- If the connection drops mid-answer, the reply ends with "(Connection interrupted — please ask again.)".
- Times in answers are always CET, whatever the visitor's time zone.
