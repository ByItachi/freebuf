# crowl

A Lovable-style AI app builder built with **Next.js (App Router) + Tailwind CSS v4**.
Describe an idea, get a project: the dashboard composer creates projects, the
workspace chats with an AI endpoint and renders a live HTML preview.

## Features

- **Dashboard home** — Lovable-accurate hero: aurora background, greeting,
  composer with Build/Plan mode picker (`Alt+P`), attach menu, connector
  marquee pill, and a live "My projects" grid (3 cards + invite card).
- **Workspace** (`/projects/[id]`) — chat with the AI, star, remix, live
  preview pane, voice input, same Build/Plan composer as the dashboard.
- **Sidebar** — workspace + account menus with Appearance (light/dark/system)
  theme switching, Documentation cascades, sign-out confirmation flow.
- **Connectors** — 75 brand icons (`public/connectors`) with connected-state
  toggles persisted locally; connected platforms lead the pill marquee.
- **Project filters** — All / My projects / Shared / Starred pages, plus
  "Recently viewed" backed by local view history.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

Optional: copy `.env.example` to `.env.local` and fill in AI keys — the app
degrades gracefully without them.

## Scripts

| Command         | What it does                          |
| --------------- | ------------------------------------- |
| `npm run dev`   | Start the dev server                  |
| `npm run build` | Production build                      |
| `npm start`     | Serve the production build            |
| `npm run lint`  | ESLint across the repo                |

## CI / Deploy

- **CI** (`.github/workflows/ci.yml`) — on every push/PR to `main`:
  typecheck (`tsc --noEmit`), lint, and production build.
- **Deploy** (`.github/workflows/deploy.yml`) — optional Vercel production
  deploy. Add repo secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  and it runs automatically on `main`; without them the job skips.

## Project structure

```
src/
  app/            # App Router pages (dashboard, projects, marketing, API routes)
  components/
    app/          # sidebar, drawers, project cards/menus
    site/         # marketing chrome (header/footer/sections)
  lib/            # use-user identity, recents history, project store
public/
  connectors/     # brand SVGs (fetch via scripts/fetch-connector-icons.mjs)
scripts/          # maintenance utilities
```

## Notes

- Theme (light/dark/system) and connected connectors persist in
  `localStorage`; project data lives in `.data/` via `src/lib/store`.
- `prefers-reduced-motion` disables all decorative animations.
