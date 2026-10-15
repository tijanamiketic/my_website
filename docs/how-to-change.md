# How to change this project

## Project layout

```
proxy.ts                language routing: "/" → Serbian, "/en" → English, "/sr/…" → redirect
app/                    routes and server code
  [lang]/               every page, once per language (lang = "sr" or "en")
    page.tsx            home page: the list of sections, in order
    layout.tsx          shared shell: fonts, <html lang>, SEO metadata, nav, chat widget, theme script
    blog/[slug]/page.tsx  one blog post page (renders the MDX file)
    opengraph-image.tsx, not-found.tsx, [...rest]/ (unknown URLs → 404 in the right language)
  globals.css           all styles: color/radius/font tokens, components, animations
  api/chat/route.ts     chat assistant endpoint (see docs/ai.md)
  sitemap.ts, robots.ts, icon.svg
components/
  sections/             one file per home-page section (Hero, About, Projects, …)
  chat/                 chat button and chat window
  Nav.tsx, LanguageSwitch.tsx, I18nProvider.tsx, ThemeToggle.tsx, MotionEffects.tsx, Ambient.tsx, ui.tsx, icons.tsx
content/                everything you normally edit: typed data files + blog posts
  types.ts              the shape of every content file
  i18n/sr.ts, i18n/en.ts  interface text (buttons, headings, labels, messages) per language
  blog/sr/<slug>.mdx    blog posts in Serbian
  blog/en/<slug>.mdx    the same posts in English (same file name)
lib/                    helpers: languages (i18n/), blog loader, news feed, chat prompt + fallback, rate limiter, config
public/                 static files: portrait, downloadable resources
reference/              the original single-file design (portfolio.html); not used by the site
```

Content and code are kept apart: for text, links, courses, events and so on you only edit files in `content/`. Each file is typed against `content/types.ts`, so the editor flags a missing or misspelled field, or a missing translation. `npm run build` fails on type errors too.

The site has two languages: Serbian (default, at `/`) and English (at `/en`). See [Translations](#translations) below.

## Common changes

After any change, run `npm run dev` and check the page in the browser. Before deploying, run `npm run lint` and `npm run build`.

### Edit text on the site

Text that visitors read has a Serbian and an English value side by side: `title: { sr: "…", en: "…" }`. Change both.

| What | File |
| --- | --- |
| Name, role, tagline, status pill, stats, bio, pillars, email, SEO description | `content/profile.ts` |
| Social links (a profile without `url` is shown greyed out as "coming soon") | `content/socials.ts` |
| Projects carousel | `content/projects.ts` |
| Interviews and press (`featured: true` highlights one) | `content/interviews.ts` |
| Courses (free / premium, price in EUR) | `content/courses.ts` |
| Resource library | `content/resources.ts` |
| Events (times are CET; past events hide automatically) | `content/events.ts` |
| AI-news feeds | `content/news-sources.ts` |
| How many blog posts show on the home page | `content/posts.ts` |
| Section headings, buttons, labels, form and error messages, footer line | `content/i18n/sr.ts` and `content/i18n/en.ts` (same key in both) |
| Navigation labels | `nav.sections` in `content/i18n/*.ts` |
| Chat quick-reply buttons and greeting | `chat.quick`, `chat.greeting` in `content/i18n/*.ts` |

Wrap a phrase in `**double asterisks**` in `profile.tagline` to make it bold.

Entries marked `MOCK` or `TODO` in `content/` are placeholders and need to be replaced with real data.

The chat assistant reads these same files, so it picks up content edits automatically.

### Add a blog post

1. Create `content/blog/sr/my-post.mdx` (Serbian) and `content/blog/en/my-post.mdx` (English) with the **same file name**. The file name becomes the URL (`/blog/my-post` and `/en/blog/my-post`). Use only letters, numbers and hyphens.
2. Start each file with frontmatter (title and excerpt in that file's language; date, cover, glyph and featured the same in both):

   ```mdx
   ---
   title: "My post title"
   date: "2026-10-01"
   excerpt: "One or two sentences for the card."
   readingTime: 6                 # optional: estimated from word count if omitted
   cover: "/blog/my-cover.webp"   # optional: file in public/blog/; omit for a generated gradient cover
   glyph: "✦"                     # optional: symbol on the generated cover
   featured: true                 # optional: the first featured post gets the wide card
   ---

   Markdown **and** JSX work here.
   ```

3. The post appears on the home page, in the sitemap and in the chat assistant's knowledge.

If you write a post in only one language, it still shows in the other, in its original language, with a note saying it isn't translated yet. Add the translation later under the same file name.

### Add a project, course, event, interview or resource

Copy an existing entry in the matching `content/*.ts` file and change the values, in both languages. Leave `image` out to get a generated gradient cover. A `url` of `"#"` is treated as "no link yet" (resources show "Coming soon").

For an interview, `duration` is optional. The featured interview's `questions` are shown as the list beside it, each linking to the same `url`. Other interviews are listed after them.

For a downloadable resource, put the file in `public/resources/` and set `url: "/resources/<file>"`, or use an external URL.

### Replace an image

- **Portrait:** replace `public/images/portrait.png` with a transparent PNG of the same name. It is used in the hero, About section, interviews, chat avatar and Open Graph image.
- **Project screenshots and blog covers:** put the file in `public/` (e.g. `public/projects/x.webp`) and reference it as `/projects/x.webp`.
- **Images from another website:** add the host to `images.remotePatterns` in `next.config.ts`, or the image will not load.

### Change colors

1. Open `app/globals.css`. Light-mode colors are the `--` variables in the first `:root { … }` block under `TOKENS`.
2. Dark-mode colors are defined **twice**: inside `@media (prefers-color-scheme: dark)` and in `:root[data-theme="dark"]`. Change both blocks the same way.
3. If you change `--bg`, update `themeColor` in `app/[lang]/layout.tsx` to match (it colors the mobile browser bar).
4. Generated cover gradients use the `PALETTE` list in `lib/cover.ts`.

### Change fonts

1. In `app/[lang]/layout.tsx`, replace the `next/font/google` import and the font call (e.g. `Inter(...)`). Keep the `variable` name (`--font-inter`, `--font-instrument`, `--font-jetbrains`), or rename it in `app/globals.css` too (`--font`, `--serif`, `--mono`).
2. Only the main UI font is preloaded. Keep `preload: false` on accent fonts.

### Add a section to the home page

1. Create `components/sections/MySection.tsx`. Copy the structure of `About.tsx`: `<section id="my-section" className="section wrap">` with a `SectionHead`.
2. Add it to `app/[lang]/page.tsx` where it should appear.
3. To link it in the navigation, add `"my-section"` to `NAV` in `lib/config.ts` and its label to `nav.sections` in both `content/i18n/sr.ts` and `en.ts`. The id must match the section's `id`.

Add `data-reveal` to an element to give it the scroll-in animation, and `data-tilt` for the cursor tilt.

### Add a separate page

1. Create `app/[lang]/my-page/page.tsx` (it becomes `/my-page` in Serbian and `/en/my-page` in English). Wrap the content in `<main id="main" className="wrap section">`. Get the language and interface text with `const { locale, t } = await getI18n()` from `@/lib/i18n/server`, and put every visible string in `content/i18n/sr.ts` and `en.ts`.
2. Add the URL to `app/sitemap.ts` for both languages.
3. Link to it from a section or from the footer (at the end of `components/sections/Contact.tsx`) with `localePath(locale, "/my-page")`, so the link stays in the current language. `NAV` only holds links to home-page sections, so do not add separate pages there.

This project uses Next.js 16, which differs from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing route code (see `AGENTS.md`).

### Translations

The rules come from the owner's Translation Standard. In short:

- **Interface text** (headings, buttons, labels, messages, `aria-label`s): `content/i18n/sr.ts` is the source. `content/i18n/en.ts` must have exactly the same keys; TypeScript fails the build if one is missing. Never type visible text directly in a component.
- **Content text**: `{ sr, en }` pairs in `content/*.ts`. Prices, dates, links and names are stored once.
- **Blog posts**: one file per language under `content/blog/sr/` and `content/blog/en/`, same file name.
- **Plurals and inserted values** are functions in the dictionary (e.g. `seatsLeft: (n) => plural("sr", n, { one, few, other })`). Serbian has three plural forms: 1 mesto, 2 mesta, 5 mesta.
- **Dates and prices** are formatted by `formatDate(iso, locale)` in `lib/format.ts` and `formatPrice(eur, locale)` in `lib/i18n/index.ts`. Don't write them by hand.
- **Not translated:** product names, brand names, outlet names, tech tags, and AI-news headlines (third-party).
- **Serbian style:** Latin script, informal "ti", „quotes“, decimal comma. Avoid gendered forms when writing about the owner (see [decisions.md](decisions.md)).

In code: Server Components call `await getI18n()` (`@/lib/i18n/server`); Client Components call `useI18n()` (`@/components/I18nProvider`); both return `{ locale, t }`. Content is turned into one language with `localize(data, locale)`. Internal links use `localePath(locale, path)`. Server Actions and Route Handlers can't read the language from the URL, so the page sends it: the chat calls `/api/chat?lang=…`.

#### Add a language

1. Add its code to `locales` and its details to `localeInfo` in `lib/i18n/index.ts`.
2. Copy `content/i18n/en.ts` to the new code, translate it and add it to `dictionaries` in `content/i18n/index.ts`.
3. TypeScript now lists every content field that needs the new language. Fill them in.
4. Add `content/blog/<code>/` with translated posts (or rely on the fallback).
5. Add the language to `REPLY_LANGUAGE` in `lib/chat-context.ts` and its answers in `lib/mock-chat.ts`.
6. Record the decision in [decisions.md](decisions.md).

### Switch the buttons back to Skool (when courses open)

While courses are "coming soon", nothing links to Skool: the nav button ("Kontaktiraj me" / "Contact me") and the hero button ("Zakaži konsultacije" / "Book a consultation") scroll to `#contact`. `SKOOL_URL` stays in `lib/config.ts` for later. To switch back:

1. Set the real community link: `NEXT_PUBLIC_SKOOL_URL` in Vercel, or `skoolUrl` in `content/profile.ts`.
2. `components/Nav.tsx`: import `SKOOL_URL` from `@/lib/config` and give both buttons (`.nav-cta` and the one at the end of the mobile menu) `href={SKOOL_URL} target="_blank" rel="noopener noreferrer"`. Remove the mobile button's `onClick`. Change the text in `nav.contactMe` in `content/i18n/sr.ts` and `en.ts`, or add new keys. The old texts were "Pridruži se" / "Join courses" (desktop) and "Pridruži se kursevima na Skoolu" / "Join courses on Skool" (mobile menu).
3. `components/sections/Hero.tsx`: same for the `btn-glass` button. The old text (`hero.bookConsultation` today) was "Pridruži se kursevima" / "Join My Courses".
4. Course cards: restore the price badge and the enroll button in `components/sections/Courses.tsx` (the version before commit `5f17463` in Git history).
5. Chat assistant: in `lib/chat-context.ts` put prices and `c.url ?? SKOOL_URL` back in the `<courses>` block and remove the "coming soon" rules; in `lib/mock-chat.ts` rewrite the `free`, `price` and `course` replies in both languages.
6. Check the nav at 1440px in both languages: a longer button text can push the links onto two lines.

### Add or remove an AI-news feed

Edit `newsSources` in `content/news-sources.ts`. Set `aiOnly: true` on general tech feeds to keep only AI headlines. Topics are assigned from headline keywords in `topicRules`. The feed is cached for 1 hour. If every feed fails, the `mockNews` items are shown.

### Change the chat assistant

See [ai.md](ai.md).

## How the parts work

- **Languages:** `proxy.ts` serves every unprefixed URL from the Serbian route (`/blog/x` → `app/[lang]/blog/x` with `lang = "sr"`), passes `/en/…` through, and redirects `/sr/…` to the unprefixed URL. Every visit to `/` is Serbian; the browser language is ignored and the choice is not remembered. The SR | EN switch (`components/LanguageSwitch.tsx`) links to the same page and keeps the `#section`. Each page lists both versions as `hreflang` alternates, and so does the sitemap.
- **Home page** is prerendered as static HTML (once per language) and refreshed hourly, so past events and new news items update without a redeploy (`"use cache"` + `cacheLife` in `lib/events.ts` and `lib/news.ts`).
- **Blog posts** are read from `content/blog/<lang>/` by `lib/blog.ts` and compiled from MDX to static HTML at build time.
- **Theme** follows the system setting until the visitor uses the toggle. The choice is saved in `localStorage` and applied before first paint by a small script in `app/[lang]/layout.tsx`.
- **Animations:** scroll reveals and background parallax are pure CSS scroll-driven animations. Cursor tilt, hero parallax and the carousel use `requestAnimationFrame` (`components/MotionEffects.tsx`, `components/sections/ProjectsCarousel.tsx`). All motion is off under `prefers-reduced-motion`.
- **SEO:** metadata in `app/[lang]/layout.tsx` and the post page, generated Open Graph image per language, `sitemap.xml` with both languages, `robots.txt`, and JSON-LD (`Person`, `BlogPosting`).

## Things that are easy to break

- **Dark mode colors live in two blocks** in `app/globals.css`. Changing only one makes dark mode look different depending on whether it came from the system or the toggle.
- **Blog file names** with spaces, dots or other symbols return "not found" (`getPost` in `lib/blog.ts` only accepts letters, numbers and hyphens). A translation with a different file name than the original becomes a separate post.
- **Visible text typed into a component** shows in one language on both versions of the site. Put it in `content/i18n/sr.ts` and `en.ts`.
- **Links written as plain paths** (`href="/blog/x"`) always open the Serbian page. Use `localePath(locale, "/blog/x")`.
- **`proxy.ts` matcher:** URLs with a dot (files) and `/api/` skip the language routing. A new page whose URL contains a dot would not get a language.
- **Dates** must be ISO strings like `"2026-10-22"`. An event with a past date disappears from the site and from the chat assistant.
- **Placeholder links (`"#"`)** are hidden from visitors and the chat. Replace them with real URLs when ready.
- **Portrait file name:** `public/images/portrait.png` is imported by name in several components. Renaming it breaks the build.
- **`turbopack.root` in `next.config.ts`** must stay. There is a stray `package.json` / `package-lock.json` in the home folder (`C:\Users\Lenovo`), and without this setting Next.js picks the wrong project root.
- **Chat system prompt must stay byte-stable:** do not add timestamps or random values to `lib/chat-context.ts`. See [ai.md](ai.md).
- **Secrets:** `.env.local` is git-ignored. Never commit API keys; `.env.example` holds names only.
- **`AGENTS.md`** is rewritten by `next dev`. Edits to it will be overwritten.
- **Git repository:** the Git repository root is currently the whole home folder (`C:\Users\Lenovo`), not this project. `TODO: confirm with owner` — create a separate repository for `website/` before deploying, so only the site is pushed.
