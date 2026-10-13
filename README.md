# Tijana Miketić — personal website

The personal website of Tijana Miketić, AI developer and educator. It is for potential students, workshop clients, journalists and other builders. It shows projects, blog posts, interviews, a live AI-news feed, courses (hosted on Skool), free resources, upcoming events and a newsletter sign-up, and has a chat assistant that answers questions about all of these.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and MDX. The chat assistant uses Claude.

## Requirements

- Node.js 20.9 or newer (tested with 22.13)
- npm

## Setup

```bash
npm install
cp .env.example .env.local   # optional: the site works without any env variables
```

### Environment variables

All are optional. Set them in `.env.local` for local work, and in Vercel → Project → Settings → Environment Variables for production. `.env.example` lists them with comments.

| Variable | Purpose | Without it |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL used for canonical links, sitemap and Open Graph | Vercel's production domain, or `http://localhost:3000` |
| `NEXT_PUBLIC_SKOOL_URL` | Skool community link used by every "Join / Enroll" button | `profile.skoolUrl` in `content/profile.ts` |
| `ANTHROPIC_API_KEY` | Turns on the Claude-powered chat assistant | A built-in keyword responder answers instead |
| `ANTHROPIC_MODEL` | Chat model override | `claude-opus-5` |
| `NEWSLETTER_WEBHOOK_URL` | Endpoint that receives `POST { email, source }` (Zapier, Make, n8n, Kit…) | Demo mode: the form says "subscribed" but nothing is sent |
| `NEWSLETTER_API_KEY` | Sent as `Authorization: Bearer <key>` to the webhook | No auth header |

## Run locally

```bash
npm run dev      # development server at http://localhost:3000
npm run lint     # check the code
npm run build    # production build
npm start        # serve the production build (run after build)
```

## Deploy

The site is not deployed yet. The planned host is Vercel.

1. Put the `website/` folder in its own Git repository and push it to GitHub (see "Git repository" in [docs/how-to-change.md](docs/how-to-change.md#things-that-are-easy-to-break)).
2. Import the repository at [vercel.com/new](https://vercel.com/new). No build settings are needed.
3. Add the environment variables above in Vercel, then redeploy.

## Documentation

- [docs/how-to-change.md](docs/how-to-change.md): project layout, step-by-step edits, things that are easy to break
- [docs/decisions.md](docs/decisions.md): what was decided and why
- [docs/ai.md](docs/ai.md): the chat assistant: prompt, model, evaluation, limitations
- [CHANGELOG.md](CHANGELOG.md): what changed and when
