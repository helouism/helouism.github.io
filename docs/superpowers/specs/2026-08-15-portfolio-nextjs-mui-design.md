# Portfolio Migration to Next.js + MUI — Design

**Date:** 2026-08-15
**Branch:** `nextjs-migration`
**Source PRD:** `portfolio_nextjs_mui_prd.md`

## 1. Goal

Replace the static Bootstrap portfolio at `helouism.github.io` with a
statically exported Next.js + MUI application. The new site keeps every piece
of real content from the current `index.html`, drops the CDN dependencies, and
reframes the positioning around IT Support and Infrastructure work.

Success means: `npm run build` produces a deployable `out/` directory, the site
renders correctly in light and dark mode at mobile through desktop widths, and
the GitHub Pages deployment continues to work after merging to `master`.

## 2. Decisions

These were settled during brainstorming and are not open questions.

| Decision | Choice |
|---|---|
| Site structure | Single route `/` with anchor-scrolled sections |
| Contact | Direct links only — no form, no third-party service |
| Repo layout | App at repo root on `nextjs-migration`; `master` untouched until merge |
| Positioning | IT Support & Infrastructure, with development as demonstrated strength |
| Accent color | Terminal green — `#00E676` dark, `#00A152` light |
| Skill display | Grouped monospace chips, replacing percentage progress bars |

## 3. Architecture

**Framework.** Next.js 15, App Router, TypeScript, `output: 'export'`. The site
is served from the domain root, so no `basePath` or `assetPrefix` is set.
`images.unoptimized` must be `true` — the default image optimizer requires a
server and breaks static export.

**MUI integration.** The root layout wraps children in `AppRouterCacheProvider`
from `@mui/material-nextjs` and renders `InitColorSchemeScript` before the app.
Together these eliminate both the unstyled-content flash and the dark-mode
flash on first paint. The theme uses MUI's `colorSchemes` API so the toggle
switches modes without a client-side re-render workaround.

**Fonts.** Inter and JetBrains Mono via `next/font/google`, self-hosted at build
time. No font CDN requests at runtime.

**Removed dependencies.** Bootstrap 5 CSS/JS, Font Awesome, and the jsDelivr
bundle are all dropped. Icons come from `@mui/icons-material`, which
tree-shakes to only the icons actually imported.

**Content model.** Content lives in typed TypeScript modules under `content/`,
not JSON. Each module exports typed data consumed by section components, so a
missing or misspelled field fails the build rather than rendering blank.

## 4. File Layout

```
app/
  layout.tsx            fonts, cache provider, theme provider, Navbar, Footer
  page.tsx              composes the sections in order
components/
  layout/
    Navbar.tsx          anchor links, mobile Drawer, ThemeToggle
    Footer.tsx          social links, copyright
    ThemeToggle.tsx     light/dark switch via useColorScheme
  sections/
    Hero.tsx  About.tsx  Skills.tsx  Projects.tsx
    Experience.tsx  Education.tsx  Contact.tsx
  ui/
    SectionHeading.tsx  numbered mono heading + code-comment subhead
    TerminalWindow.tsx  title bar + prompt chrome (hero only)
    ProjectCard.tsx     thumbnail, title, description, tech chips, links
    TechChip.tsx        monospace MUI Chip
theme/
  theme.ts              palette, typography, component overrides
content/
  profile.ts  projects.ts  experience.ts  education.ts
  skills.ts   socials.ts
public/
  assets/laptop-screenshot.webp
  assets/helouism-blog.webp
  docs/my-cv.pdf
  .nojekyll
next.config.ts
.github/workflows/deploy.yml
```

The old `index.html`, `css/style.css`, `js/theme-toggle.js`, and the original
`assets/` and `docs/` directories are deleted on this branch. They remain
recoverable from `master`'s history.

## 5. Design System

### Palette

Monochromatic base with exactly one accent. No secondary color, and no
per-item color coding (the current site colors each skill card differently;
that goes away).

| Token | Dark | Light |
|---|---|---|
| background default | `#0A0C0A` | `#FAFAF8` |
| background paper | `#0E110E` | `#FFFFFF` |
| text primary | `#E6E8E6` | `#16181A` |
| text secondary | `#9AA09A` | `#5A6169` |
| accent (primary) | `#00E676` | `#00A152` |
| divider | `rgba(230,232,230,0.10)` | `rgba(22,24,26,0.10)` |

The light-mode accent is darkened specifically to hold WCAG AA contrast against
white; `#00E676` on white does not pass.

### Typography

- **Inter** — headings and body prose.
- **JetBrains Mono** — tech chips, dates, section numbers, terminal chrome, and
  all code-comment micro-copy.

The mono/sans pairing is the primary carrier of the tech theme; it is applied
consistently rather than decoratively.

### Motif and anti-templated details

- **Terminal window, used once.** The hero is styled as a terminal: title bar
  with three dots, a `hendrik@infra:~$` prompt, and the title typed out
  followed by a blinking cursor. This treatment appears in the hero only. A
  motif used once reads as a signature; repeated in every section it reads as a
  gimmick.
- **Asymmetry.** Hero content is offset left rather than centered. The featured
  project card spans wider than the second rather than sitting in a perfect
  2×2 grid.
- **Numbered headings.** Each section heading carries a mono `01 //` style
  index and a code-comment subhead (e.g. `// what I actually do`).
- **Hover states.** Accent border shift plus a 2px lift, not a generic
  scale-up.
- **Background.** A low-opacity grid pattern sits behind the hero only.

### Motion

Subtle and purposeful: MUI transitions on buttons and cards, the hero cursor
blink, and a fade-in on the hero. Nothing scroll-jacking. The cursor blink and
any entrance animation respect `prefers-reduced-motion`.

## 6. Content Plan

### Hero

Title: **IT Support & Infrastructure**. Subhead micro-copy positions
development as a demonstrated strength ("L1 support who reads the logs, then
writes the fix"). Two buttons: *View Projects* (contained) and *Download CV*
(outlined, → `/docs/my-cv.pdf`).

### About

Rewritten from the existing bio with infrastructure-first framing. Retains the
Pamulang University Informatics Engineering background and 2024 graduation, but
these are supporting facts rather than the headline. The "Fresh Graduate" badge
is removed — it is two years stale.

### Skills

Percentage progress bars are removed. Self-assigned numbers are unverifiable
and read as filler to the infrastructure and sysadmin audience this site now
targets. Replaced with three groups of monospace chips:

- **Support & Infra** — L1 helpdesk, TCP/IP, routers & switches, firewall
  configuration, Linux, hardware & software support
- **Build** — PHP, CodeIgniter 4, Laravel, JavaScript, React, Python,
  SQL/MySQL
- **Tools** — Git, Bootstrap, jQuery

### Projects

Both existing projects migrate with their real content:

1. **Laptop Recommender System** — full-stack recommendation app.
   Stack: JavaScript, jQuery, PHP, Bootstrap, MySQL.
   Repo `github.com/helouism/rekomendasi-laptop`, demo
   `blegasul.serv00.net`. Screenshot `laptop-screenshot.webp`. Featured card.
2. **Simple Blog** — CodeIgniter 4 blog with Shield auth, post and category
   management, social sharing.
   Stack: JavaScript, QuillJS, jQuery, CodeIgniter 4, CodeIgniter Shield,
   Bootstrap 5, SweetAlert2, MySQL. Repo
   `github.com/helouism/helouism-blog`, no live demo. Screenshot
   `helouism-blog.webp`.

### Experience

1. **L1 IT Support (Infra / App / Helpdesk)** — current role. *Company, start
   date, and responsibilities are not yet supplied.* Scaffolded with an
   explicit `TODO` marker in `content/experience.ts` so the build succeeds
   while the gap stays visible. Must be filled before merging to `master`.
2. **Web Development Intern** — PT Dinamika Tiara Universal, Tangerang.
   Mar 2023 – Jun 2023. Website layouts and UI in HTML/CSS/JS; responsive
   design for cross-device compatibility.
3. **Network Administrator** — Indonesia University of Education, Bandung.
   Feb 2018 – Mar 2018. TCP/IP and network troubleshooting; router and switch
   configuration; server administration and monitoring; firewall configuration
   and network security practices.

### Education

1. Bachelor of Informatics Engineering, Pamulang University, 2020–2024,
   GPA 3.62.
2. Computer Network Engineering, Prima Unggul Vocational High School,
   2016–2019.

### Contact

No form. A card with direct links: email `hendrikmahdi@gmail.com` (with
copy-to-clipboard), WhatsApp `+62 851-5656-1231`, LinkedIn, GitHub, and
location Tangerang Selatan, Banten.

Note: the current site's footer links LinkedIn to a GitHub URL. The new footer
links LinkedIn to the correct
`linkedin.com/in/hendrik-louis-mahdi-b0ba67178/`.

### Writing / Articles

Out of scope for this build. The PRD marks it optional, and there is no article
source to pull from yet. No section, no placeholder, no dead nav link.

## 7. Deployment

`.github/workflows/static.yml` is replaced by `.github/workflows/deploy.yml`:

```
checkout → setup-node 20 (npm cache) → npm ci → npm run build
        → upload-pages-artifact (path: out) → deploy-pages
```

The trigger stays `push` to `master` plus `workflow_dispatch`. Nothing deploys
while work continues on `nextjs-migration`; the live site changes only on
merge.

`public/.nojekyll` is included so GitHub Pages does not strip the `_next`
directory.

## 8. Verification

Work is not complete until all of these have been run and their output
observed:

1. `npm run build` completes with no errors and produces `out/` containing
   `index.html` and `_next/`.
2. `npx tsc --noEmit` reports no type errors.
3. `npm run lint` is clean.
4. Dev server renders correctly at 360px, 768px, and 1440px widths.
5. Both light and dark modes render with correct contrast; no flash of
   unstyled or wrongly-themed content on reload.
6. Every migrated link resolves: both repos, the live demo, the CV PDF, and
   all four contact links.

Lighthouse is run as a final check with accessibility as the priority metric.

## 9. Out of Scope

- Articles/blog feed
- Contact form and any third-party form service
- MDX or a CMS
- Analytics
- Merging to `master` — that is the user's call after review
