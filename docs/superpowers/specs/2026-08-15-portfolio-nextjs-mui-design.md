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
| accent (primary) | `#00E676` | `#007A3D` |
| divider | `rgba(230,232,230,0.10)` | `rgba(22,24,26,0.10)` |

The light-mode accent is darkened specifically to hold WCAG AA contrast against
white. `#00E676` on white measures 1.44:1 — unusable. An earlier draft of this
spec proposed `#00A152`, but that measures 3.38:1, which clears the 3:1 bar for
large text and UI components while still failing the 4.5:1 bar for body text.
`#007A3D` measures 5.45:1 and passes for all text sizes.

These ratios are enforced by unit tests over the palette, not asserted by hand,
so a future palette edit that breaks contrast fails the build.

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

### Navigation

Brand `helouism` on the left. Links: About, Skills, Projects, Experience,
Contact — each scrolling to its section anchor. Education is reachable by
scroll but omitted from the nav to keep it to five items. A *Resume* button
(→ `/docs/my-cv.pdf`) sits at the right as the CTA, next to the theme toggle.
Below the `md` breakpoint the links collapse into a Drawer; the toggle and CTA
stay visible.

Sections render in this order: Hero, About, Skills, Projects, Experience,
Education, Contact.

### Hero

Title: **IT Support & Infrastructure**. Subhead micro-copy positions
development as a demonstrated strength ("L1 support who reads the logs, then
writes the fix"). Two buttons: *View Projects* (contained) and *Download CV*
(outlined, → `/docs/my-cv.pdf`).

### About

Rewritten from the existing bio with infrastructure-first framing, leading with
the current Lintas Media Danawa role: someone who keeps enterprise systems and
applications running, and who reaches for logs, queries, and code rather than
just reassigning the ticket. Retains the Pamulang University Informatics
Engineering background and 2024 graduation, but as supporting facts rather than
the headline. The "Fresh Graduate" badge is removed — it is two years stale.

### Skills

Percentage progress bars are removed. Self-assigned numbers are unverifiable
and read as filler to the infrastructure and sysadmin audience this site now
targets. Replaced with four groups of monospace chips, ordered so the
support/infra evidence leads:

- **Support & Operations** — L1 helpdesk, ServiceDesk Plus, eBesha CRM, SLA
  management, incident triage & escalation, server/network/application
  monitoring
- **Systems & Infrastructure** — Windows, Linux, macOS, VMware, Proxmox,
  SSH/FTP/SFTP, TCP/IP, routers & switches, firewall configuration, hardware
  & software support
- **Databases** — MySQL, PostgreSQL, SQL, Navicat
- **Development** — PHP, Laravel, CodeIgniter 4, JavaScript, React, Python,
  Git, log analysis & debugging

Every chip here is backed by something visible elsewhere on the page — the
current role, a prior role, or a shipped project. Nothing is aspirational.

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

1. **L1 IT Support / Helpdesk — Infra & Apps** — Lintas Media Danawa,
   Depok, West Java. Contract, on-site. Oct 2025 – Present.

   First-level technical support and infrastructure monitoring for internal
   users and external clients: diagnosing, resolving, and escalating hardware,
   software, network, and enterprise application issues.

   - Manage and track support tickets in ServiceDesk Plus and eBesha CRM to
     meet SLA targets
   - Troubleshoot across Windows, Linux, and macOS environments
   - Run database checks and queries against MySQL and PostgreSQL
   - Support Laravel/PHP web applications by analyzing logs and identifying
     bugs
   - Proactively monitor servers, networks, and applications to detect and
     report anomalies
   - Communicate status to users and escalate to L2/L3 when needed

   This is the lead experience entry and the anchor of the site's positioning.
   It is rendered first and given more visual weight than the older roles.
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
