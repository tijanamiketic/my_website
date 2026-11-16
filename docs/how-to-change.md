# How to change this project

## Project layout

```
proxy.ts                language routing: "/" → Serbian, "/en" → English, "/sr/…" → redirect
app/                    routes and server code
  [lang]/               every page, once per language (lang = "sr" or "en")
    page.tsx            home page: the list of sections, in order
    layout.tsx          shared shell: fonts, <html lang>, SEO metadata, nav, chat widget, theme script
    blog/[slug]/page.tsx  one blog post page (renders the MDX file)
    news/[slug]/page.tsx  one AI news article page (same layout as a blog post)
    resources/[slug]/page.tsx  one resource document page (renders the .md file, with a download button)
    opengraph-image.tsx, not-found.tsx, [...rest]/ (unknown URLs → 404 in the right language)
  globals.css           all styles: color/radius/font tokens, components, animations
  api/chat/route.ts     chat assistant endpoint (see docs/ai.md)
  sitemap.ts, robots.ts, icon.svg
components/
  sections/             one file per home-page section (Hero, About, Projects, …)
  chat/                 chat button and chat window
  ArticlePage.tsx       shared article page for blog posts and AI news
  ResourcePage.tsx      page for one resource document (same layout as an article)
  PostGrid.tsx          shared card grid for the Blog and AI News sections
  Nav.tsx, LanguageSwitch.tsx, I18nProvider.tsx, ThemeToggle.tsx, MotionEffects.tsx, Ambient.tsx, ui.tsx, icons.tsx
content/                everything you normally edit: typed data files + blog posts + news articles
  types.ts              the shape of every content file
  i18n/sr.ts, i18n/en.ts  interface text (buttons, headings, labels, messages) per language
  blog/sr/<slug>.mdx    blog posts in Serbian
  blog/en/<slug>.mdx    the same posts in English (same file name)
  news/sr/<slug>.mdx    AI news articles in Serbian
  news/en/<slug>.mdx    the same articles in English (same file name)
lib/                    helpers: languages (i18n/), article loader (articles.ts, used by blog.ts and news.ts), chat prompt + fallback, rate limiter, config
public/                 static files: portrait; resources/<slug>.md = resource documents (original Obsidian notes)
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
| Services carousel (section id `projects`; each card links to Contact) | `content/projects.ts` |
| Interviews and press (`featured: true` highlights one) | `content/interviews.ts` |
| Courses (free / premium, price in EUR) | `content/courses.ts` |
| Resources: which documents are listed, their categories (filters) | `content/resources.ts` (documents themselves: `public/resources/<slug>.md`) |
| Events and their categories (filters, role badges); times are CET; past events hide automatically | `content/events.ts` |
| How many blog posts and news articles show on the home page | `content/posts.ts` |
| Section headings, buttons, labels, form and error messages | `content/i18n/sr.ts` and `content/i18n/en.ts` (same key in both) |
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

### Add a project, course, event or interview

Copy an existing entry in the matching `content/*.ts` file and change the values, in both languages. Leave `image` out to get a generated gradient cover. A `url` of `"#"` is treated as "no link yet".

A service card in `content/projects.ts` has no URL: its link always scrolls to Contact. Write a tag as a plain string when it is the same in both languages (`"LLM"`), or as `{ sr: "…", en: "…" }`.

For an interview, `duration` is optional. The featured interview's `questions` are shown as the list beside it, each linking to the same `url`. Other interviews are listed after them.

### Add an event or an event category

Add an entry to `events` in `content/events.ts`. Order doesn't matter: dated events are sorted soonest first, undated ("coming soon") ones go last.

- `category`: `workshops`, `meetups`, `speaking` (I'm a speaker) or `attending` (I'm a guest). It sets the filter and the small role badge on the card.
- `date` (and `endDate` for a multi-day event, shown as "02–03" in the date tile). Leave `date` out for a greyed-out "coming soon" card.
- `note`: optional small muted text under the description (e.g. a disclaimer).
- The button: `url` = "Prijavi se" / "Register" (with seats), `website` = "Zvanični sajt" / "Official website", `notes` = "Pročitaj beleške" / "Read my notes". If more than one is set, `notes` wins, then `website`. A notes path like `"/blog/<slug>"` opens the post in the visitor's language.

For a new category, add a line to `eventCategories` in the same file with the filter `label` and the card `badge`, both in two languages. Every category's filter is always shown; an empty one says "Uskoro novi događaji u ovoj kategoriji" / "New events coming soon". No component changes are needed.

### Add a resource (a document from Obsidian)

1. Copy the note **unchanged** to `public/resources/<slug>.md` (short English kebab-case name, e.g. `documentation-standard.md`). Copy the file itself (Explorer, `cp`); don't paste its text into an editor, which may change line endings or add a final newline. Visitors download exactly this file.
2. Add an entry to `resources` in `content/resources.ts`: `{ slug, category, lang, updated }`. `lang` is the language the note is written in; `updated` is the date of its last change (`"YYYY-MM-DD"`).
3. For a new category, add it to `resourceCategories` in the same file with both labels: `myCategory: { sr: "…", en: "…" }`. Its filter appears when at least one resource uses it.

No component changes are needed. The card title and description come from the note: frontmatter `title` / `description` if present, otherwise the first `# ` heading and the first paragraph after it. The page is `/resources/<slug>` (`/en/resources/<slug>`), shown in the note's language on both versions of the site (the other version shows a "only available in …" note and points search engines to the original). It is added to the sitemap and the chat assistant's knowledge.

Obsidian syntax is converted for display only (`lib/obsidian.ts`): `[[wikilinks]]` become plain text, `![[embeds]]` and `%%comments%%` are removed, callouts become quotes with a bold title, `==highlights==` become plain text, tags stay as text. Images are not supported yet. Markdown tables, lists and code blocks render as usual.

To update a document, copy the new version over the old file and change `updated`.

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
- **Blog posts and news articles**: one file per language under `content/blog/sr/` and `content/blog/en/` (news: `content/news/…`), same file name.
- **Plurals and inserted values** are functions in the dictionary (e.g. `seatsLeft: (n) => plural("sr", n, { one, few, other })`). Serbian has three plural forms: 1 mesto, 2 mesta, 5 mesta.
- **Dates and prices** are formatted by `formatDate(iso, locale)` in `lib/format.ts` and `formatPrice(eur, locale)` in `lib/i18n/index.ts`. Don't write them by hand.
- **Not translated:** product names, brand names, outlet names and tech tags. Link titles in an article's sources list stay in the outlet's language.
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

### Add an AI news article

1. Create `content/news/sr/<slug>.mdx` and `content/news/en/<slug>.mdx` with the same file name (short English kebab-case slug).
2. Use the same frontmatter as a blog post (see `content/posts.ts`): `title`, `date` (the event date, `"YYYY-MM-DD"`), `readingTime`, `excerpt`, `glyph`. `featured` is ignored: news is always newest first.
3. End the article with a `---` line and the sources list (**Izvori:** / **Sources:**).

The article appears in the AI News section on the home page (the newest `newsOnHome` from `content/posts.ts`) and at `/news/<slug>` (`/en/news/<slug>`), and is added to the sitemap. A full listing page can later use `news.getAll(locale)` from `lib/news.ts`.

### Change the chat assistant

See [ai.md](ai.md).

## How the parts work

- **Languages:** `proxy.ts` serves every unprefixed URL from the Serbian route (`/blog/x` → `app/[lang]/blog/x` with `lang = "sr"`), passes `/en/…` through, and redirects `/sr/…` to the unprefixed URL. Every visit to `/` is Serbian; the browser language is ignored and the choice is not remembered. The SR | EN switch (`components/LanguageSwitch.tsx`) links to the same page and keeps the `#section`. Each page lists both versions as `hreflang` alternates, and so does the sitemap.
- **Home page** is prerendered as static HTML (once per language) and refreshed hourly, so past events update without a redeploy (`"use cache"` + `cacheLife` in `lib/events.ts`). New blog posts and news articles need a redeploy.
- **Blog posts and news articles** are read from `content/blog/<lang>/` and `content/news/<lang>/` by `lib/articles.ts` (through `lib/blog.ts` and `lib/news.ts`) and compiled from MDX to static HTML at build time.
- **Theme** follows the system setting until the visitor uses the toggle. The choice is saved in `localStorage` and applied before first paint by a small script in `app/[lang]/layout.tsx`.
- **Animations:** scroll reveals and background parallax are pure CSS scroll-driven animations. Cursor tilt, hero parallax and the carousel use `requestAnimationFrame` (`components/MotionEffects.tsx`, `components/sections/ProjectsCarousel.tsx`). All motion is off under `prefers-reduced-motion`.
- **SEO:** metadata in `app/[lang]/layout.tsx` and the post page, generated Open Graph image per language, `sitemap.xml` with both languages, `robots.txt`, and JSON-LD (`Person`, `BlogPosting`, `NewsArticle`).

## Things that are easy to break

- **Dark mode colors live in two blocks** in `app/globals.css`. Changing only one makes dark mode look different depending on whether it came from the system or the toggle.
- **Blog and news file names** with spaces, dots or other symbols return "not found" (`get` in `lib/articles.ts` only accepts letters, numbers and hyphens). A translation with a different file name than the original becomes a separate post.
- **Visible text typed into a component** shows in one language on both versions of the site. Put it in `content/i18n/sr.ts` and `en.ts`.
- **Links written as plain paths** (`href="/blog/x"`) always open the Serbian page. Use `localePath(locale, "/blog/x")`.
- **`proxy.ts` matcher:** URLs with a dot (files) and `/api/` skip the language routing. A new page whose URL contains a dot would not get a language.
- **Dates** must be ISO strings like `"2026-10-22"`. An event with a past date disappears from the site and from the chat assistant. An event with no `date` is shown greyed out as "coming soon", with registration disabled.
- **Placeholder links (`"#"`)** are hidden from visitors and the chat. Replace them with real URLs when ready.
- **Resource files are served byte for byte.** `.gitattributes` turns off line-ending conversion for `public/resources/`, so Git on Windows doesn't change the downloaded file. `next.config.ts` (`headers`) makes every `/resources/*.md` file download instead of opening in the browser. A resource `slug` must match its file name exactly.
- **Portrait file name:** `public/images/portrait.png` is imported by name in several components. Renaming it breaks the build.
- **`turbopack.root` in `next.config.ts`** must stay. There is a stray `package.json` / `package-lock.json` in the home folder (`C:\Users\Lenovo`), and without this setting Next.js picks the wrong project root.
- **Chat system prompt must stay byte-stable:** do not add timestamps or random values to `lib/chat-context.ts`. See [ai.md](ai.md).
- **Secrets:** `.env.local` is git-ignored. Never commit API keys; `.env.example` holds names only.
- **`AGENTS.md`** is rewritten by `next dev`. Edits to it will be overwritten.
- **Git repository:** the Git repository root is currently the whole home folder (`C:\Users\Lenovo`), not this project. `TODO: confirm with owner` — create a separate repository for `website/` before deploying, so only the site is pushed.
