# Decisions

Newest first. Entries are never rewritten. If a decision changes, add a new entry that replaces the old one.

The entries dated 2026-10-10 were recorded when the documentation was created. They describe decisions already visible in the project; the actual decision dates are earlier.

## 2026-10-14: Serbian by default, English as a second language
**Decision:** The site is published in Serbian and English. Serbian is the default and lives at `/` with no prefix (`/blog/<slug>`); English lives under `/en` (`/en/blog/<slug>`). `/sr/...` redirects to the unprefixed URL. Every visitor who opens `/` gets Serbian: the browser language is not detected and the last choice is not remembered. The SR | EN switch in the navigation links to the same page and section in the other language.
**Why:** The owner wants Serbian to be what every visitor sees first, with English one click away. Separate URLs per language let search engines index both versions and make every link predictable. Rejected: a cookie or client-side toggle (one URL showing two languages cannot be indexed and breaks static rendering); redirecting by browser language (visitors and search engines would get different pages for the same URL).
**Consequences:** All routes live under `app/[lang]`; `proxy.ts` maps unprefixed URLs to `sr`. Both languages are prerendered. Adding a language is a code change (see "Translations" in [how-to-change.md](how-to-change.md)). Rules come from the owner's Translation Standard.

## 2026-10-14: How Serbian is written
**Decision:** Serbian in Latin script (`sr-Latn`), ekavian, informal address ("ti"). Product names, brand names, the newsletter name ("The Sunday Prompt"), outlet names and tech tags are not translated. AI-news headlines stay in their original language (English) and are marked `lang="en"`. Text about the owner avoids grammatical gender where the owner has not supplied the wording; the hero role "AI Specijalista i Edukator" is the owner's own text. Translations were drafted by AI. TODO: confirm with owner (script, "ti" vs "vi", gendered forms) and have a fluent speaker review them before launch.
**Why:** Latin script matches the existing Serbian keywords in the chat fallback and the owner's name spelling. Informal "ti" fits the friendly, hands-on voice of the English site.
**Consequences:** Switching to Cyrillic or "vi" means editing `content/i18n/sr.ts`, the `sr` values in `content/*.ts` and `content/blog/sr/`, plus `localeInfo` in `lib/i18n/index.ts` for Cyrillic.

## 2026-10-14: Translations stored next to the facts, in typed files
**Decision:** Interface text lives in one dictionary per language (`content/i18n/sr.ts` is the source; `en.ts` must have the same keys, checked by TypeScript). Content fields that visitors read are `{ sr, en }` pairs in the existing `content/*.ts` files; prices, dates, URLs and names stay single values. Blog posts are one MDX file per language with the same slug (`content/blog/sr/`, `content/blog/en/`). A post missing in one language is shown in the other with a notice, and its canonical URL points to the original. No i18n library.
**Why:** Keeps "one fact, one place": a price or date can't differ between languages. TypeScript fails the build on a missing key or translation. The site is small enough that a library (next-intl etc.) would add more than it saves. Rejected: separate content files per language (facts would be duplicated).
**Consequences:** Every new visible string or content field needs both languages in the same change. Client Components read the language through `useI18n()`; Server Components through `getI18n()`; the newsletter action and chat API receive it explicitly (form field, `?lang=`).

## 2026-10-10: Design ported from a single-file prototype
**Decision:** The look (glassmorphism, pastel palette, Inter / Instrument Serif / JetBrains Mono, 3D scroll reveals) comes from `reference/portfolio.html`, a standalone HTML demo. It is kept in the repository for reference but is not used by the site.
**Why:** TODO: confirm with owner.
**Consequences:** Design tokens in `app/globals.css` mirror the prototype. The reference file can drift from the live site and should not be edited as if it were the source.

## 2026-10-10: Animations in CSS, motion off for reduced-motion users
**Decision:** Scroll reveals and parallax use CSS scroll-driven animations, with no JavaScript on scroll. Only cursor tilt, hero parallax and the carousel use `requestAnimationFrame`. All of it is disabled under `prefers-reduced-motion`.
**Why:** Keeps scrolling smooth and the JavaScript small; respects accessibility settings. Browsers without scroll-timeline support simply show content at rest.
**Consequences:** Animations are configured through `data-reveal`, `data-tilt` and `data-stagger` attributes plus CSS, not a JS library.

## 2026-10-10: AI news from public RSS feeds, cached for one hour
**Decision:** The AI News section fetches the RSS/Atom feeds in `content/news-sources.ts` on the server, merges and de-duplicates them, and caches the result for 1 hour. If every feed fails, clearly labelled mock items are shown.
**Why:** Fresh content with no paid news API and no database; the section never appears empty.
**Consequences:** Headlines depend on third-party feeds that can change format or disappear. Topics come from keyword rules, so some are misclassified.

## 2026-10-10: Newsletter through a generic webhook
**Decision:** The sign-up form posts `{ email, source }` to whatever URL is in `NEWSLETTER_WEBHOOK_URL`. Without it, the form runs in demo mode.
**Why:** Keeps the site independent of any one newsletter provider (Zapier, Make, n8n, Kit all accept this). The newsletter provider is TODO: confirm with owner.
**Consequences:** Switching providers needs only an env-variable change. Until the variable is set, sign-ups are silently lost.

## 2026-10-10: In-memory rate limiting
**Decision:** The chat endpoint and newsletter form are rate-limited per IP with a small in-memory limiter (`lib/rate-limit.ts`), not Redis or Vercel KV.
**Why:** Good enough to stop casual abuse on a personal site, with no extra service to set up or pay for.
**Consequences:** On Vercel each server instance has its own memory, so the limit is per instance, not global. Swap in Upstash Redis or Vercel KV if a strict limit is needed.

## 2026-10-10: Chat assistant on Claude, with an offline fallback
**Decision:** The chat widget calls Claude through the Anthropic SDK. Without an API key, or when the API fails, a keyword-based responder answers from the same content. Details in [ai.md](ai.md).
**Why:** The widget never dead-ends, and the site can run and be developed with no API key or cost.
**Consequences:** Two answer paths must be kept in sync with the content (both read `content/` automatically). The fallback is much less capable.

## 2026-10-10: Courses hosted on Skool
**Decision:** The site does not sell or host courses. Every "Join / Enroll" button links to the Skool community (`NEXT_PUBLIC_SKOOL_URL` or `profile.skoolUrl`).
**Why:** TODO: confirm with owner.
**Consequences:** No payments, accounts or course pages on the site. Course details on the site must be kept in step with Skool by hand.

## 2026-10-10: Content in typed files and MDX, no CMS
**Decision:** All content is in TypeScript files and MDX posts under `content/`, checked against `content/types.ts`. There is no CMS or database.
**Why:** Content can be edited without touching components, and typos in field names are caught by the editor and the build. Whether a CMS was considered: TODO: confirm with owner.
**Consequences:** Every content change is a code change and needs a redeploy. Non-technical editors need help or a Git-based workflow.

## 2026-10-10: Hosting on Vercel
**Decision:** The site is to be deployed on Vercel. Not deployed yet.
**Why:** TODO: confirm with owner.
**Consequences:** Code relies on Vercel defaults (e.g. `VERCEL_PROJECT_PRODUCTION_URL` in `lib/config.ts`). Serverless instances affect the rate limiter (see above).

## 2026-10-10: Next.js 16 with TypeScript and Tailwind CSS v4
**Decision:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript in strict mode, Tailwind CSS v4 reading CSS variables from `app/globals.css`.
**Why:** TODO: confirm with owner.
**Consequences:** Next.js 16 APIs differ from older versions and from most online examples; read `node_modules/next/dist/docs/` before changing route code. Most styling is plain CSS classes in `globals.css`; Tailwind utilities share the same tokens.
