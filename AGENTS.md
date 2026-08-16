# AGENTS.md

Guidance for AI agents working in this repo. Read this before editing anything.

## What this is

The personal portfolio of **Hendrik Louis Mahdi** (GitHub `helouism`), an L1 IT
Support / Helpdesk engineer in Tangerang Selatan, Indonesia. It is a single page
with anchor-scrolled sections, statically exported and served at
<https://helouism.github.io/>.

**This describes a real person.** Every claim in `content/` — a job, a date, a
skill, a GPA — is a factual statement about someone's career that a recruiter may
read. Never invent, embellish, or "round up" a detail to make a section look
fuller. If you need a fact that is not already in the repo, ask for it. That rule
outranks every other convention in this file.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # vitest run — 12 files, ~127 tests
npm run typecheck  # tsc --noEmit
npm run lint       # eslint
npm run build      # static export to out/
```

`npm test` runs in CI **before** the build, so a red test blocks the deploy
rather than publishing a broken site. Run `npm test && npm run typecheck` before
claiming any change is done.

Node 24 is required (`.nvmrc`, `engines`). jsdom 30 / undici 8 cannot start a
test worker on Node 20.

## Where things live

```
app/
  layout.tsx        root layout, fonts, <head> metadata (SEO description)
  page.tsx          the single page — composes the seven sections in order
content/            ALL copy and data. The single source of truth.
  types.ts          every content shape
  profile.ts        name, title, tagline, hero micro-copy, fact card
  skills.ts         skill groups
  projects.ts       project cards
  experience.ts     jobs
  education.ts      degrees
  socials.ts        contact links
  nav.ts            navItems + SECTION_ORDER
components/
  layout/           Navbar, Footer, ThemeToggle
  sections/         one component per section, each renders content/
  ui/               SectionHeading, ProjectCard, TechChip, TerminalWindow
theme/
  palette.ts        the two colour schemes (dark + light)
  theme.ts          MUI theme, CSS-variable colour schemes
  contrast.ts       WCAG contrast ratio helper
public/
  assets/           project screenshots (.webp)
  docs/my-cv.pdf    the CV the hero links to
```

**Components never hard-code copy.** If you are typing a sentence, a job title,
or a technology name inside a `.tsx` file, you are in the wrong file — it belongs
in `content/`. Tests read from `content/` too, so content and assertions cannot
drift apart.

Import alias: `@/` maps to the repo root (`@/content/projects`, `@/theme/theme`).

## Changing content

### The trap: tests pin the counts

`content/__tests__/content.test.ts` asserts exact lengths. **Adding or removing
any entry fails a test until you update the count.** This is intentional — it
forces a deliberate look at the section rather than a silent append.

| Adding to | Update this assertion |
|---|---|
| `projects.ts` | `has both projects` → `toHaveLength(2)` |
| `experience.ts` | `has three roles` → `toHaveLength(3)` |
| `skills.ts` (a group) | `has four groups` → `toHaveLength(4)` |
| `education.ts` | `has both entries` → `toHaveLength(2)` |
| `nav.ts` | `exposes five nav items` → `toHaveLength(5)` |
| `profile.facts` | `carries three facts` → `toHaveLength(3)` |

Adding an *item* to an existing skill group needs no count change.

### Add a project

1. Add an entry to `content/projects.ts` matching `Project` in `types.ts`.
2. `slug` must be unique (a test enforces it).
3. `repo` is **optional** — omit it entirely when the source is private, and the
   card renders a muted "Source private" note. Never set it to `''`: that renders
   the same but reads as an unfinished field, and a test rejects it.
4. `demo` is optional. A project with neither `repo` nor `demo` fails a test —
   a card with no way out is a dead end.
5. Both URLs must be `https://`.
6. `alt` must be non-empty and must not be another project's title.
7. Add the screenshot (see below) and bump the count assertion.

All cards are laid out identically. There is no `featured` flag — one used to
span both grid columns, but with an even number of projects that left the last
row half empty, which reads as a card that failed to load rather than as
emphasis. If you want a hero card back, add it only when there are enough
projects to fill the row beneath it, and expect
`lays every card out identically` to fail (that is the test doing its job).

### Add a skill

Append the string to the right group's `items` in `content/skills.ts`. Groups are
ordered deliberately: **Support & Operations leads** (a test pins it) because the
positioning is "IT support who codes", not "developer". Development comes last.

No duplicates across groups — a test enforces it. Each item renders as a
`TechChip`; keep labels short, and include versions only when they carry
information (`Laravel 12`, not `Git 2`).

### Add a job

Append to `content/experience.ts` (`Job` in `types.ts`). Tests enforce:

- Exactly one job has `current: true`, and it must be **first** in the array.
- Every job has at least one bullet.
- No `TODO` / `TBD` / `LOREM` anywhere in the content.

`profile.facts` derives the "current" employer from this file, so changing the
current job automatically updates the About fact card. Do not retype the company
name in `profile.ts`.

### Add an education entry

Append to `content/education.ts`. `note` is the short badge beside the years (a
GPA); `description` is prose beneath. They are different fields — do not merge.

### Add a screenshot or image

- Format **WebP**, roughly 1900px wide, quality ~80, into `public/assets/`.
- Reference it as `/assets/name.webp` (leading slash, no `public/`).
- `content/__tests__/assets.test.ts` fails if the file is missing on disk.
- Convert PNGs with `sharp` (already a transitive dependency) and delete the
  PNG — anything left in `public/` ships to the live site.
- Check the screenshot for browser chrome, full-screen toasts, or personal data
  before committing. Cards crop to the top 200px, so junk at the top is visible.

### Add a whole section

1. Create `components/sections/Name.tsx`, wrapping in
   `<Box component="section" id="name">`.
2. Add the id to `SECTION_ORDER` in `content/nav.ts` **in render order**.
3. Render it in `app/page.tsx` in that same order.
4. Give `<SectionHeading index={N} …>` the id's **position in `SECTION_ORDER`**.
   `app/__tests__/page-contract.test.tsx` compares the printed `01`, `02`, … to
   that index and fails on any mismatch. Inserting a section mid-page renumbers
   every section after it.
5. Add to `navItems` only if it should appear in the navbar. `education` is
   deliberately rendered but not in the nav.

## Invariants the tests protect

Read the test before "fixing" it. Each of these encodes a bug that actually
happened:

- **`role="list"` on every marker-suppressed list.** WebKit strips the implicit
  list role when `list-style: none`, silencing the "list, N items" announcement.
  Any `<Box component="ul">` with `listStyle: 'none'` needs the explicit role.
- **Palette contrast.** `theme/__tests__/palette.test.ts` holds every colour pair
  to WCAG AA (4.5:1). The bright green `#00E676` is dark-mode only; light mode
  uses `#007A3D`. A test explicitly rejects the bright green on white.
- **One `<nav>` landmark with `aria-label="Main"`**, in both the desktop bar and
  the mobile drawer.
- **Accessible names.** Repeated controls need distinguishing labels
  (`Source code for OmniLog`). Per WCAG 2.5.3 the accessible name must contain
  the visible text.
- **No unverifiable claims.** Tests assert the profile never says "fresh
  graduate", never claims job-seeking status, and never repeats the hero title in
  the fact card.

When you add a test, prove it can fail. Write it first and watch it go red, or
mutate the implementation and confirm it catches the mutation. A test that has
never failed is not evidence of anything.

## Deploy

Push to `master` → `.github/workflows/deploy.yml` runs `npm ci`, `npm test`,
`npm run build`, and publishes `out/` to GitHub Pages. There is no staging
environment; master is production.

Verify a deploy by fetching the live site, not by trusting the green check.

## Repo hygiene

- **Never `git add -A` or `git add .`.** Stage files by explicit path.
  `.claude/` and `portfolio_nextjs_mui_prd.md` are intentionally untracked and
  must never be committed. `.superpowers/` holds session working notes and does
  not appear in `git status`; leave it alone.
- **Never move or delete `docs/superpowers/`** — the original spec and plan.
- Commit and push only when asked. Pushing to `master` deploys to the live site.
