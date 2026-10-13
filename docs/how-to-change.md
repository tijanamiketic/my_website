# How to change this project

## Project layout

```
app/                    routes and server code
  page.tsx              home page: the list of sections, in order
  layout.tsx            shared shell: fonts, SEO metadata, nav, chat widget, theme script
  globals.css           all styles: color/radius/font tokens, components, animations
  blog/[slug]/page.tsx  one blog post page (renders the MDX file)
  api/chat/route.ts     chat assistant endpoint (see docs/ai.md)
  actions/newsletter.ts newsletter sign-up (server action)
  sitemap.ts, robots.ts, opengraph-image.tsx, icon.svg, not-found.tsx
components/
  sections/             one file per home-page section (Hero, About, Projects, …)
  chat/                 chat button and chat window
  Nav.tsx, ThemeToggle.tsx, MotionEffects.tsx, Ambient.tsx, ui.tsx, icons.tsx
content/                everything you normally edit: typed data files + blog posts
  types.ts              the shape of every content file
  blog/<slug>.mdx       blog posts
lib/                    helpers: blog loader, news feed, chat prompt + fallback, rate limiter, config
public/                 static files: portrait, downloadable resources
reference/              the original single-file design (portfolio.html); not used by the site
```

Content and code are kept apart: for text, links, courses, events and so on you only edit files in `content/`. Each file is typed against `content/types.ts`, so the editor flags a missing or misspelled field. `npm run build` fails on type errors too.

## Common changes

After any change, run `npm run dev` and check the page in the browser. Before deploying, run `npm run lint` and `npm run build`.

### Edit text on the site

| What | File |
| --- | --- |
| Name, role, tagline, status pill, stats, hero badges, bio, pillars, email, newsletter text, SEO description | `content/profile.ts` |
| Social links | `content/socials.ts` |
| Projects carousel | `content/projects.ts` |
| Interviews and press (`featured: true` highlights one) | `content/interviews.ts` |
| Courses (free / premium, price in EUR) | `content/courses.ts` |
| Resource library | `content/resources.ts` |
| Events (times are CET; past events hide automatically) | `content/events.ts` |
| AI-news feeds | `content/news-sources.ts` |
| How many blog posts show on the home page | `content/posts.ts` |
| Section headings (e.g. "Making AI *make sense*") | the matching file in `components/sections/` (`SectionHead` props) |
| Chat quick-reply buttons and greeting | `components/chat/ChatWindow.tsx` (`QUICK`, `GREETING`) |

Wrap a phrase in `**double asterisks**` in `profile.tagline` to make it bold.

Entries marked `MOCK` or `TODO` in `content/` are placeholders and need to be replaced with real data.

The chat assistant reads these same files, so it picks up content edits automatically.

### Add a blog post

1. Create `content/blog/my-post.mdx`. The file name becomes the URL (`/blog/my-post`). Use only letters, numbers and hyphens.
2. Start the file with frontmatter:

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

### Add a project, course, event, interview or resource

Copy an existing entry in the matching `content/*.ts` file and change the values. Leave `image` out to get a generated gradient cover. A `url` of `"#"` is treated as "no link yet" (resources show "Coming soon").

For a downloadable resource, put the file in `public/resources/` and set `url: "/resources/<file>"`, or use an external URL.

### Replace an image

- **Portrait:** replace `public/images/portrait.png` with a transparent PNG of the same name. It is used in the hero, About section, interviews, chat avatar and Open Graph image.
- **Project screenshots and blog covers:** put the file in `public/` (e.g. `public/projects/x.webp`) and reference it as `/projects/x.webp`.
- **Images from another website:** add the host to `images.remotePatterns` in `next.config.ts`, or the image will not load.

### Change colors

1. Open `app/globals.css`. Light-mode colors are the `--` variables in the first `:root { … }` block under `TOKENS`.
2. Dark-mode colors are defined **twice**: inside `@media (prefers-color-scheme: dark)` and in `:root[data-theme="dark"]`. Change both blocks the same way.
3. If you change `--bg`, update `themeColor` in `app/layout.tsx` to match (it colors the mobile browser bar).
4. Generated cover gradients use the `PALETTE` list in `lib/cover.ts`.

### Change fonts

1. In `app/layout.tsx`, replace the `next/font/google` import and the font call (e.g. `Inter(...)`). Keep the `variable` name (`--font-inter`, `--font-instrument`, `--font-jetbrains`), or rename it in `app/globals.css` too (`--font`, `--serif`, `--mono`).
2. Only the main UI font is preloaded. Keep `preload: false` on accent fonts.

### Add a section to the home page

1. Create `components/sections/MySection.tsx`. Copy the structure of `About.tsx`: `<section id="my-section" className="section wrap">` with a `SectionHead`.
2. Add it to `app/page.tsx` where it should appear.
3. To link it in the navigation, add `{ id: "my-section", label: "…" }` to `NAV` in `lib/config.ts`. The `id` must match the section's `id`.

Add `data-reveal` to an element to give it the scroll-in animation, and `data-tilt` for the cursor tilt.

### Add a separate page

1. Create `app/my-page/page.tsx` (it becomes `/my-page`). Wrap the content in `<main id="main" className="wrap section">`.
2. Add the URL to `app/sitemap.ts`.
3. Link to it from a section or from the footer (at the end of `components/sections/Contact.tsx`). `NAV` only holds links to home-page sections, so do not add separate pages there.

This project uses Next.js 16, which differs from older versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing route code (see `AGENTS.md`).

### Add or remove an AI-news feed

Edit `newsSources` in `content/news-sources.ts`. Set `aiOnly: true` on general tech feeds to keep only AI headlines. Topics are assigned from headline keywords in `topicRules`. The feed is cached for 1 hour. If every feed fails, the `mockNews` items are shown.

### Connect the newsletter

Set `NEWSLETTER_WEBHOOK_URL` (see [README](../README.md#environment-variables)). To call a provider's API directly instead, replace the `TODO` block in `app/actions/newsletter.ts`.

### Change the chat assistant

See [ai.md](ai.md).

## How the parts work

- **Home page** is prerendered as static HTML and refreshed hourly, so past events and new news items update without a redeploy (`"use cache"` + `cacheLife` in `lib/events.ts` and `lib/news.ts`).
- **Blog posts** are read from `content/blog/` by `lib/blog.ts` and compiled from MDX to static HTML at build time.
- **Theme** follows the system setting until the visitor uses the toggle. The choice is saved in `localStorage` and applied before first paint by a small script in `app/layout.tsx`.
- **Animations:** scroll reveals and background parallax are pure CSS scroll-driven animations. Cursor tilt, hero parallax and the carousel use `requestAnimationFrame` (`components/MotionEffects.tsx`, `components/sections/ProjectsCarousel.tsx`). All motion is off under `prefers-reduced-motion`.
- **Newsletter:** `app/actions/newsletter.ts` validates the email, rejects bots with a hidden honeypot field (`company`), rate-limits per IP and posts to the webhook.
- **SEO:** metadata in `app/layout.tsx` and the post page, generated Open Graph image, `sitemap.xml`, `robots.txt`, and JSON-LD (`Person`, `BlogPosting`).

## Things that are easy to break

- **Dark mode colors live in two blocks** in `app/globals.css`. Changing only one makes dark mode look different depending on whether it came from the system or the toggle.
- **Blog file names** with spaces, dots or other symbols return "not found" (`getPost` in `lib/blog.ts` only accepts letters, numbers and hyphens).
- **Dates** must be ISO strings like `"2026-10-22"`. An event with a past date disappears from the site and from the chat assistant.
- **Placeholder links (`"#"`)** are hidden from visitors and the chat. Replace them with real URLs when ready.
- **Portrait file name:** `public/images/portrait.png` is imported by name in several components. Renaming it breaks the build.
- **`turbopack.root` in `next.config.ts`** must stay. There is a stray `package.json` / `package-lock.json` in the home folder (`C:\Users\Lenovo`), and without this setting Next.js picks the wrong project root.
- **Chat system prompt must stay byte-stable:** do not add timestamps or random values to `lib/chat-context.ts`. See [ai.md](ai.md).
- **Secrets:** `.env.local` is git-ignored. Never commit API keys; `.env.example` holds names only.
- **`AGENTS.md`** is rewritten by `next dev`. Edits to it will be overwritten.
- **Git repository:** the Git repository root is currently the whole home folder (`C:\Users\Lenovo`), not this project. `TODO: confirm with owner` — create a separate repository for `website/` before deploying, so only the site is pushed.
