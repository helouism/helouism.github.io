# helouism.github.io

Personal portfolio of **Hendrik Louis Mahdi** — L1 IT Support / Helpdesk, infra
and applications, based in Tangerang Selatan, Indonesia.

**Live: <https://helouism.github.io/>**

Single page, anchor-scrolled sections, dark and light themes. Built with Next.js
(App Router, static export), MUI, and TypeScript. Statically exported and served
from GitHub Pages — no server, no database, no analytics.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

Requires Node 24 (see `.nvmrc`).

## Deploy

Pushing to `master` runs the test suite, builds the static export, and publishes
it to GitHub Pages via `.github/workflows/deploy.yml`. Tests run before the
build, so a failure blocks the deploy instead of shipping.

## Working on it

All copy and data live in `content/` — components render it, and the tests read
from it. See [AGENTS.md](AGENTS.md) for the full layout, the conventions, and
what the test suite enforces.
