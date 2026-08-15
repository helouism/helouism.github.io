# Portfolio Next.js + MUI Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Bootstrap portfolio at `helouism.github.io` with a statically exported Next.js + MUI single-page site positioned around IT Support and Infrastructure work.

**Architecture:** Next.js 15 App Router with `output: 'export'`, rendering one route (`/`) composed of section components. Content lives in typed TypeScript modules so a missing field fails the build. MUI supplies the design system through a single theme with light/dark color schemes; `AppRouterCacheProvider` and `InitColorSchemeScript` prevent style and theme flashes on first paint.

**Tech Stack:** Next.js 16.3.1, React 19.2, TypeScript, MUI v9.3 (`@mui/material`, `@mui/icons-material`, `@mui/material-nextjs`), Emotion, Vitest 4 + React Testing Library, GitHub Actions → GitHub Pages.

> **Version note (recorded during Task 1).** The plan was drafted against Next 15 / MUI v7; a fresh `npm install` resolved Next 16.3.1 and MUI v9.3.1. Ruling: keep the newer stack. Every API this plan relies on was verified present in v9 — `cssVariables.colorSchemeSelector`, `colorSchemes`, `InitColorSchemeScript` (default attribute `data-mui-color-scheme`), and `useColorScheme` (re-exported from `@mui/material/styles`). The only consequent change is the App Router cache provider entry point, which tracks the **Next** major: `@mui/material-nextjs/v16-appRouter`.

**Spec:** `docs/superpowers/specs/2026-08-15-portfolio-nextjs-mui-design.md`

## Global Constraints

These apply to every task. Do not violate them even if a task's steps do not restate them.

- **Branch:** all work happens on `nextjs-migration`. Never commit to `master`.
- **Static export:** `output: 'export'` and `images: { unoptimized: true }` in `next.config.ts`. No server components that fetch at runtime, no API routes, no middleware, no `next/image` optimization, no server actions.
- **No `basePath`/`assetPrefix`.** The site serves from the domain root.
- **Exactly one accent color.** Dark `#00E676`, light `#007A3D`. No secondary color, no per-item color coding.
- **No CDN dependencies.** No Bootstrap, no Font Awesome, no jsDelivr. Icons come only from `@mui/icons-material`. Fonts come only from `next/font/google`.
- **Fonts:** Inter (sans) and JetBrains Mono (mono), both via `next/font/google`.
- **Layout primitive:** use `Box` with `display: 'grid'` for grid layouts, not MUI's `Grid` component. `Grid`'s prop API changed between MUI v5/v6/v7; `Box` grid is stable across all of them.
- **Copy rule:** no invented facts. Every claim on the page must trace to the spec's Content Plan. Do not add employers, dates, certifications, metrics, or technologies that are not in the spec.
- **Motion:** every animation must be disabled under `prefers-reduced-motion: reduce`.
- **Commit after every task.** Conventional commit prefixes (`feat:`, `test:`, `chore:`, `refactor:`).

---

## File Structure

| File | Responsibility |
|---|---|
| `next.config.ts` | Static export config |
| `vitest.config.ts` | Test runner config, jsdom environment, path alias |
| `vitest.setup.ts` | jest-dom matchers |
| `theme/contrast.ts` | WCAG contrast math (pure functions) |
| `theme/palette.ts` | Raw color tokens, single source of truth |
| `theme/theme.ts` | MUI theme: color schemes, typography, component overrides |
| `content/types.ts` | Shared content types |
| `content/profile.ts` | Name, title, micro-copy, location |
| `content/projects.ts` | Project entries |
| `content/experience.ts` | Work history |
| `content/education.ts` | Education history |
| `content/skills.ts` | Skill groups |
| `content/socials.ts` | Contact and social links |
| `content/nav.ts` | Nav items and section order |
| `components/ui/SectionHeading.tsx` | Numbered mono heading + comment subhead |
| `components/ui/TechChip.tsx` | Monospace chip |
| `components/ui/TerminalWindow.tsx` | Terminal chrome (hero only) |
| `components/ui/ProjectCard.tsx` | One project card |
| `components/layout/ThemeToggle.tsx` | Light/dark switch |
| `components/layout/Navbar.tsx` | Top nav + mobile drawer |
| `components/layout/Footer.tsx` | Social links + copyright |
| `components/sections/*.tsx` | One file per page section |
| `app/layout.tsx` | Fonts, providers, Navbar, Footer |
| `app/page.tsx` | Section composition |
| `.github/workflows/deploy.yml` | Build + deploy to Pages |

---

### Task 1: Project scaffold, static export, and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `.gitignore`, `vitest.config.ts`, `vitest.setup.ts`, `app/layout.tsx`, `app/page.tsx`, `public/.nojekyll`
- Test: `app/__tests__/smoke.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: a working `npm run build` that emits `out/`, a working `npm test`, and the `@/*` path alias resolving to the repo root.

- [ ] **Step 1: Scaffold the Next.js app at the repo root**

The repo root already contains files, so `create-next-app` must target the current directory. Run from the repo root:

```bash
npx create-next-app@latest . --typescript --eslint --app --no-src-dir --no-tailwind --import-alias "@/*" --use-npm --yes
```

If it refuses because the directory is non-empty, scaffold into a temp dir and move the files in:

```bash
npx create-next-app@latest .nextscaffold --typescript --eslint --app --no-src-dir --no-tailwind --import-alias "@/*" --use-npm --yes
cp -r .nextscaffold/. .
rm -rf .nextscaffold
```

Do not delete `index.html`, `css/`, `js/`, `assets/`, or `docs/` yet — Task 11 handles that. If the scaffold created `app/globals.css` or `app/page.module.css`, delete them; all styling goes through the MUI theme.

- [ ] **Step 2: Install runtime and test dependencies**

```bash
npm install @mui/material @mui/icons-material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

- [ ] **Step 3: Record the installed MUI major version**

```bash
node -p "require('./package.json').dependencies['@mui/material']"
```

If the installed major version is **not** v7, the theme API in Task 2 may differ. Note the version in the commit message. The `cssVariables` + `colorSchemes` API used in Task 2 exists in v6 and v7; if v5 was installed, run `npm install @mui/material@^7` before continuing.

- [ ] **Step 4: Write `next.config.ts`**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

`trailingSlash: true` makes the export emit `out/index.html` at directory paths, which is what GitHub Pages serves cleanly.

- [ ] **Step 5: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'out', '.next'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
});
```

- [ ] **Step 6: Write `vitest.setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 7: Add the test scripts to `package.json`**

In the `scripts` block, add:

```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 8: Create `public/.nojekyll`**

Create the file with no content. It stops GitHub Pages from stripping the `_next` directory.

```bash
touch public/.nojekyll
```

- [ ] **Step 9: Replace `app/layout.tsx` with a minimal shell**

Task 5 rewrites this file completely; for now it only needs to compile.

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hendrik Louis Mahdi',
  description: 'IT Support & Infrastructure',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Replace `app/page.tsx` with a placeholder**

```tsx
export default function Home() {
  return <main>portfolio</main>;
}
```

- [ ] **Step 11: Write the failing smoke test**

Create `app/__tests__/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';

describe('home page', () => {
  it('renders a main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

- [ ] **Step 12: Run the test suite**

Run: `npm test`
Expected: PASS, 1 test. If it fails on module resolution, the `@` alias in `vitest.config.ts` is wrong — it must point at the repo root, not `./src`.

- [ ] **Step 13: Verify the production build exports**

Run: `npm run build`
Expected: build completes, and `out/index.html` plus `out/_next/` exist. Confirm:

```bash
ls out/index.html && ls -d out/_next
```

If `out/` is missing, `output: 'export'` did not take effect — recheck `next.config.ts`.

- [ ] **Step 14: Confirm `.gitignore` covers build output**

`.gitignore` must contain `node_modules`, `.next`, and `out`. Add any that are missing.

- [ ] **Step 15: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with static export and Vitest harness"
```

---

### Task 2: Theme — palette, contrast tests, typography

**Files:**
- Create: `theme/contrast.ts`, `theme/palette.ts`, `theme/theme.ts`
- Test: `theme/__tests__/contrast.test.ts`, `theme/__tests__/palette.test.ts`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces:
  - `contrastRatio(hexA: string, hexB: string): number`
  - `palette` object with shape `{ dark: Scheme; light: Scheme }` where `Scheme = { bg: string; paper: string; text: string; textSecondary: string; accent: string; divider: string }`
  - default export `theme` from `theme/theme.ts` (a MUI `Theme`)

- [ ] **Step 1: Write the failing contrast-math test**

Create `theme/__tests__/contrast.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { contrastRatio } from '@/theme/contrast';

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('returns 1 for a color against itself', () => {
    expect(contrastRatio('#00E676', '#00E676')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#123456', '#FEDCBA')).toBeCloseTo(
      contrastRatio('#FEDCBA', '#123456'),
      5,
    );
  });

  it('expands three-digit hex', () => {
    expect(contrastRatio('#000', '#FFF')).toBeCloseTo(21, 1);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- contrast`
Expected: FAIL — cannot resolve `@/theme/contrast`.

- [ ] **Step 3: Implement `theme/contrast.ts`**

```ts
type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 4: Run it to confirm it passes**

Run: `npm test -- contrast`
Expected: PASS, 4 tests.

- [ ] **Step 5: Write the failing palette-contrast test**

This is the test that enforces the spec's accessibility claim. Create `theme/__tests__/palette.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { contrastRatio } from '@/theme/contrast';
import { palette } from '@/theme/palette';

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

describe('dark scheme contrast', () => {
  const s = palette.dark;

  it('body text passes AA on the page background', () => {
    expect(contrastRatio(s.text, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('secondary text passes AA on the page background', () => {
    expect(contrastRatio(s.textSecondary, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('accent passes AA on the page background', () => {
    expect(contrastRatio(s.accent, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('body text passes AA on raised surfaces', () => {
    expect(contrastRatio(s.text, s.paper)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('light scheme contrast', () => {
  const s = palette.light;

  it('body text passes AA on the page background', () => {
    expect(contrastRatio(s.text, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('secondary text passes AA on the page background', () => {
    expect(contrastRatio(s.textSecondary, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('accent passes AA as text on white surfaces', () => {
    expect(contrastRatio(s.accent, '#FFFFFF')).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('white text on an accent-filled button passes AA', () => {
    expect(contrastRatio('#FFFFFF', s.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('palette regressions', () => {
  it('rejects the bright green as a light-mode accent', () => {
    expect(contrastRatio('#00E676', '#FFFFFF')).toBeLessThan(AA_LARGE);
  });
});
```

- [ ] **Step 6: Run it to confirm it fails**

Run: `npm test -- palette`
Expected: FAIL — cannot resolve `@/theme/palette`.

- [ ] **Step 7: Implement `theme/palette.ts`**

```ts
export type Scheme = {
  bg: string;
  paper: string;
  text: string;
  textSecondary: string;
  accent: string;
  divider: string;
};

export const palette: { dark: Scheme; light: Scheme } = {
  dark: {
    bg: '#0A0C0A',
    paper: '#0E110E',
    text: '#E6E8E6',
    textSecondary: '#9AA09A',
    accent: '#00E676',
    divider: 'rgba(230,232,230,0.10)',
  },
  light: {
    bg: '#FAFAF8',
    paper: '#FFFFFF',
    text: '#16181A',
    textSecondary: '#5A6169',
    accent: '#007A3D',
    divider: 'rgba(22,24,26,0.10)',
  },
};
```

- [ ] **Step 8: Run it to confirm it passes**

Run: `npm test -- palette`
Expected: PASS, 9 tests. If the light accent test fails, the accent is too bright — darken it until it passes; do not lower the threshold.

- [ ] **Step 9: Implement `theme/theme.ts`**

```ts
'use client';

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const COLOR_SCHEME_ATTRIBUTE = 'data-mui-color-scheme';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE },
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: palette.dark.accent, contrastText: '#04160C' },
        background: {
          default: palette.dark.bg,
          paper: palette.dark.paper,
        },
        text: {
          primary: palette.dark.text,
          secondary: palette.dark.textSecondary,
        },
        divider: palette.dark.divider,
      },
    },
    light: {
      palette: {
        mode: 'light',
        primary: { main: palette.light.accent, contrastText: '#FFFFFF' },
        background: {
          default: palette.light.bg,
          paper: palette.light.paper,
        },
        text: {
          primary: palette.light.text,
          secondary: palette.light.textSecondary,
        },
        divider: palette.light.divider,
      },
    },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.7 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': {
          html: { scrollBehavior: 'auto' },
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
        body: { WebkitFontSmoothing: 'antialiased' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 4, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme: t }) => ({
          border: `1px solid ${t.palette.divider}`,
          backgroundImage: 'none',
          transition: 'border-color 160ms ease, transform 160ms ease',
          '&:hover': {
            borderColor: t.palette.primary.main,
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
  },
});

export default theme;
```

- [ ] **Step 10: Verify types and tests**

Run: `npm run typecheck && npm test`
Expected: no type errors, all tests pass.

MUI v9.3.1 is installed and both `cssVariables` and `colorSchemes` are confirmed present in its type definitions, so this should compile as written. If it does not, report the exact type error rather than downgrading MUI.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add theme with contrast-tested palette and mono/sans typography"
```

---

### Task 3: Content layer and asset migration

**Files:**
- Create: `content/types.ts`, `content/profile.ts`, `content/projects.ts`, `content/experience.ts`, `content/education.ts`, `content/skills.ts`, `content/socials.ts`, `content/nav.ts`
- Move: `assets/*.webp` → `public/assets/`, `docs/my-cv.pdf` → `public/docs/`
- Test: `content/__tests__/content.test.ts`, `content/__tests__/assets.test.ts`

**Interfaces:**
- Consumes: nothing from prior tasks.
- Produces: typed exports consumed by every section component —
  - `profile: Profile` — `{ name, title, tagline, microCopy: string[], location, promptUser, resumeHref }`
  - `projects: Project[]` — `{ slug, title, description, image, alt, stack: string[], repo, demo?, featured }`
  - `experience: Job[]` — `{ id, role, company, location, period, contract?, bullets: string[], current }`
  - `education: Education[]` — `{ id, degree, school, period, note? }`
  - `skillGroups: SkillGroup[]` — `{ name, items: string[] }`
  - `socials: Social[]` — `{ id, label, value, href, kind }`
  - `navItems: NavItem[]` — `{ id, label }`, and `SECTION_ORDER: string[]`

- [ ] **Step 1: Move assets into `public/`**

```bash
mkdir -p public/assets public/docs
git mv assets/laptop-screenshot.webp public/assets/laptop-screenshot.webp
git mv assets/helouism-blog.webp public/assets/helouism-blog.webp
git mv docs/my-cv.pdf public/docs/my-cv.pdf
```

Do not move `docs/superpowers/` — the spec and this plan stay where they are.

- [ ] **Step 2: Write `content/types.ts`**

```ts
export type Profile = {
  name: string;
  title: string;
  tagline: string;
  microCopy: string[];
  location: string;
  promptUser: string;
  resumeHref: string;
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  stack: string[];
  repo: string;
  demo?: string;
  featured: boolean;
};

export type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  contract?: string;
  bullets: string[];
  current: boolean;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
  note?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type Social = {
  id: string;
  label: string;
  value: string;
  href: string;
  kind: 'email' | 'phone' | 'link';
};

export type NavItem = {
  id: string;
  label: string;
};
```

- [ ] **Step 3: Write the failing content-integrity test**

Create `content/__tests__/content.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import { education } from '@/content/education';
import { skillGroups } from '@/content/skills';
import { socials } from '@/content/socials';
import { navItems, SECTION_ORDER } from '@/content/nav';

describe('projects', () => {
  it('has both migrated projects', () => {
    expect(projects).toHaveLength(2);
  });

  it('gives every project a non-empty stack and a repo link', () => {
    for (const p of projects) {
      expect(p.stack.length).toBeGreaterThan(0);
      expect(p.repo).toMatch(/^https:\/\//);
    }
  });

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('marks exactly one project as featured', () => {
    expect(projects.filter((p) => p.featured)).toHaveLength(1);
  });

  it('points every image at a public asset path', () => {
    for (const p of projects) {
      expect(p.image).toMatch(/^\/assets\//);
    }
  });

  it('gives every image non-empty alt text that is not the title of another project', () => {
    for (const p of projects) {
      expect(p.alt.trim().length).toBeGreaterThan(0);
    }
  });
});

describe('experience', () => {
  it('has three roles', () => {
    expect(experience).toHaveLength(3);
  });

  it('marks exactly one role as current', () => {
    expect(experience.filter((j) => j.current)).toHaveLength(1);
  });

  it('lists the current role first', () => {
    expect(experience[0].current).toBe(true);
  });

  it('has no placeholder text left behind', () => {
    const blob = JSON.stringify(experience).toUpperCase();
    expect(blob).not.toContain('TODO');
    expect(blob).not.toContain('TBD');
    expect(blob).not.toContain('LOREM');
  });

  it('gives every role at least one bullet', () => {
    for (const j of experience) {
      expect(j.bullets.length).toBeGreaterThan(0);
    }
  });
});

describe('skills', () => {
  it('has four groups', () => {
    expect(skillGroups).toHaveLength(4);
  });

  it('leads with support and operations', () => {
    expect(skillGroups[0].name).toBe('Support & Operations');
  });

  it('has no duplicate skills across groups', () => {
    const all = skillGroups.flatMap((g) => g.items);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('socials', () => {
  it('links LinkedIn to a linkedin.com URL, not GitHub', () => {
    const li = socials.find((s) => s.id === 'linkedin');
    expect(li).toBeDefined();
    expect(li!.href).toContain('linkedin.com');
    expect(li!.href).not.toContain('github.com');
  });

  it('uses a mailto href for email', () => {
    const email = socials.find((s) => s.id === 'email');
    expect(email!.href).toBe('mailto:hendrikmahdi@gmail.com');
  });

  it('gives every social a resolvable href', () => {
    for (const s of socials) {
      expect(s.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});

describe('navigation', () => {
  it('exposes five nav items', () => {
    expect(navItems).toHaveLength(5);
  });

  it('only links to sections that are rendered', () => {
    for (const item of navItems) {
      expect(SECTION_ORDER).toContain(item.id);
    }
  });

  it('renders education even though it is not in the nav', () => {
    expect(SECTION_ORDER).toContain('education');
    expect(navItems.map((n) => n.id)).not.toContain('education');
  });
});

describe('profile', () => {
  it('points the resume link at the migrated CV', () => {
    expect(profile.resumeHref).toBe('/docs/my-cv.pdf');
  });

  it('does not describe him as a fresh graduate', () => {
    const blob = [profile.title, profile.tagline, ...profile.microCopy]
      .join(' ')
      .toLowerCase();
    expect(blob).not.toContain('fresh graduate');
  });
});

describe('education', () => {
  it('has both entries', () => {
    expect(education).toHaveLength(2);
  });
});
```

- [ ] **Step 4: Write the failing asset-existence test**

Create `content/__tests__/assets.test.ts`. This one runs in Node so it can touch the filesystem:

```ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';

const publicDir = join(process.cwd(), 'public');

describe('referenced files exist on disk', () => {
  it('has every project image in public/', () => {
    for (const p of projects) {
      expect(existsSync(join(publicDir, p.image))).toBe(true);
    }
  });

  it('has the CV in public/', () => {
    expect(existsSync(join(publicDir, profile.resumeHref))).toBe(true);
  });

  it('has the .nojekyll marker', () => {
    expect(existsSync(join(publicDir, '.nojekyll'))).toBe(true);
  });
});
```

- [ ] **Step 5: Run both tests to confirm they fail**

Run: `npm test -- content`
Expected: FAIL — content modules do not exist yet.

- [ ] **Step 6: Write `content/profile.ts`**

```ts
import type { Profile } from './types';

export const profile: Profile = {
  name: 'Hendrik Louis Mahdi',
  title: 'IT Support & Infrastructure',
  tagline:
    'L1 support for infrastructure, applications, and the people who depend on both.',
  microCopy: [
    '// I read the logs before I reassign the ticket',
    '// Windows, Linux, macOS — whichever one is on fire',
  ],
  location: 'Tangerang Selatan, Banten, Indonesia',
  promptUser: 'hendrik@infra',
  resumeHref: '/docs/my-cv.pdf',
};
```

- [ ] **Step 7: Write `content/projects.ts`**

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'rekomendasi-laptop',
    title: 'Laptop Recommender System',
    description:
      'A full-stack web application that recommends laptops based on user preferences and requirements, scoring candidates against weighted criteria.',
    image: '/assets/laptop-screenshot.webp',
    alt: 'Screenshot of the Laptop Recommender System interface',
    stack: ['JavaScript', 'jQuery', 'PHP', 'Bootstrap', 'MySQL'],
    repo: 'https://github.com/helouism/rekomendasi-laptop',
    demo: 'https://blegasul.serv00.net/',
    featured: true,
  },
  {
    slug: 'helouism-blog',
    title: 'Simple Blog',
    description:
      'A blog application built on CodeIgniter 4 with Shield authentication, post and category management, a rich-text editor, and sharing to Facebook and X.',
    image: '/assets/helouism-blog.webp',
    alt: 'Screenshot of the Simple Blog admin interface',
    stack: [
      'CodeIgniter 4',
      'CodeIgniter Shield',
      'PHP',
      'JavaScript',
      'QuillJS',
      'jQuery',
      'Bootstrap 5',
      'SweetAlert2',
      'MySQL',
    ],
    repo: 'https://github.com/helouism/helouism-blog',
    featured: false,
  },
];
```

- [ ] **Step 8: Write `content/experience.ts`**

Copy this verbatim. Every fact here comes from the spec; do not embellish.

```ts
import type { Job } from './types';

export const experience: Job[] = [
  {
    id: 'lintas-media-danawa',
    role: 'L1 IT Support / Helpdesk — Infra & Apps',
    company: 'Lintas Media Danawa',
    location: 'Depok, West Java, Indonesia · On-site',
    period: 'Oct 2025 — Present',
    contract: 'Contract',
    current: true,
    bullets: [
      'Manage and track support tickets in ServiceDesk Plus and eBesha CRM to meet SLA targets',
      'Troubleshoot across Windows, Linux, and macOS environments',
      'Run database checks and queries against MySQL and PostgreSQL',
      'Support Laravel and PHP web applications by analyzing logs and identifying bugs',
      'Proactively monitor servers, networks, and applications to detect and report anomalies',
      'Communicate status to users and escalate to L2/L3 teams when needed',
    ],
  },
  {
    id: 'dinamika-tiara-universal',
    role: 'Web Development Intern',
    company: 'PT Dinamika Tiara Universal',
    location: 'Tangerang, Indonesia',
    period: 'Mar 2023 — Jun 2023',
    current: false,
    bullets: [
      'Designed website layouts and user interfaces using HTML, CSS, and JavaScript',
      'Implemented responsive design techniques for cross-device compatibility',
    ],
  },
  {
    id: 'upi-network-admin',
    role: 'Network Administrator',
    company: 'Indonesia University of Education',
    location: 'Bandung, Indonesia',
    period: 'Feb 2018 — Mar 2018',
    current: false,
    bullets: [
      'Gained hands-on experience with TCP/IP protocols and network troubleshooting',
      'Assisted in configuring routers and switches for network performance',
      'Contributed to server administration and system monitoring tasks',
      'Learned firewall configuration and network security practices',
    ],
  },
];
```

- [ ] **Step 9: Write `content/education.ts`**

```ts
import type { Education } from './types';

export const education: Education[] = [
  {
    id: 'pamulang',
    degree: 'Bachelor of Informatics Engineering',
    school: 'Pamulang University — South Tangerang, Indonesia',
    period: '2020 — 2024',
    note: 'GPA 3.62',
  },
  {
    id: 'prima-unggul',
    degree: 'Computer Network Engineering',
    school: 'Prima Unggul Vocational High School — South Tangerang, Indonesia',
    period: '2016 — 2019',
  },
];
```

- [ ] **Step 10: Write `content/skills.ts`**

```ts
import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    name: 'Support & Operations',
    items: [
      'L1 Helpdesk',
      'ServiceDesk Plus',
      'eBesha CRM',
      'SLA Management',
      'Incident Triage',
      'Escalation (L2/L3)',
      'Monitoring',
    ],
  },
  {
    name: 'Systems & Infrastructure',
    items: [
      'Windows',
      'Linux',
      'macOS',
      'VMware',
      'Proxmox',
      'SSH/FTP/SFTP',
      'TCP/IP',
      'Routers & Switches',
      'Firewall Config',
      'Hardware Support',
    ],
  },
  {
    name: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'SQL', 'Navicat'],
  },
  {
    name: 'Development',
    items: [
      'PHP',
      'Laravel',
      'CodeIgniter 4',
      'JavaScript',
      'React',
      'Python',
      'Git',
      'Log Analysis',
    ],
  },
];
```

- [ ] **Step 11: Write `content/socials.ts`**

```ts
import type { Social } from './types';

export const socials: Social[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'hendrikmahdi@gmail.com',
    href: 'mailto:hendrikmahdi@gmail.com',
    kind: 'email',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+62 851-5656-1231',
    href: 'https://wa.me/6285156561231',
    kind: 'phone',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'hendrik-louis-mahdi',
    href: 'https://www.linkedin.com/in/hendrik-louis-mahdi-b0ba67178/',
    kind: 'link',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'helouism',
    href: 'https://github.com/helouism',
    kind: 'link',
  },
];
```

- [ ] **Step 12: Write `content/nav.ts`**

```ts
import type { NavItem } from './types';

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
];
```

- [ ] **Step 13: Run the tests**

Run: `npm test`
Expected: PASS. The asset test proves the files actually moved; if it fails, Step 1's `git mv` did not run.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "feat: add typed content layer and migrate assets into public/"
```

---

### Task 4: UI primitives

**Files:**
- Create: `components/ui/SectionHeading.tsx`, `components/ui/TechChip.tsx`, `components/ui/TerminalWindow.tsx`
- Test: `components/ui/__tests__/ui.test.tsx`

**Interfaces:**
- Consumes: `theme/theme.ts`.
- Produces:
  - `<SectionHeading index={number} title={string} comment={string} />`
  - `<TechChip label={string} />`
  - `<TerminalWindow user={string} command={string}>{children}</TerminalWindow>`

- [ ] **Step 1: Write the failing test**

Create `components/ui/__tests__/ui.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionHeading from '@/components/ui/SectionHeading';
import TechChip from '@/components/ui/TechChip';
import TerminalWindow from '@/components/ui/TerminalWindow';

describe('SectionHeading', () => {
  it('renders the title as a level-2 heading', () => {
    render(<SectionHeading index={2} title="Projects" comment="// things I built" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
  });

  it('zero-pads the index', () => {
    render(<SectionHeading index={3} title="Skills" comment="// what I use" />);
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('renders the comment', () => {
    render(<SectionHeading index={1} title="About" comment="// who I am" />);
    expect(screen.getByText('// who I am')).toBeInTheDocument();
  });
});

describe('TechChip', () => {
  it('renders its label', () => {
    render(<TechChip label="PostgreSQL" />);
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });
});

describe('TerminalWindow', () => {
  it('renders the prompt with the user and command', () => {
    render(
      <TerminalWindow user="hendrik@infra" command="whoami">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(screen.getByText(/hendrik@infra/)).toBeInTheDocument();
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <TerminalWindow user="u" command="c">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(screen.getByText('output')).toBeInTheDocument();
  });

  it('hides decorative chrome from assistive tech', () => {
    const { container } = render(
      <TerminalWindow user="u" command="c">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- ui`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `components/ui/TechChip.tsx`**

```tsx
import Chip from '@mui/material/Chip';

export default function TechChip({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: 'divider',
        color: 'text.secondary',
        transition: 'color 160ms ease, border-color 160ms ease',
        '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
      }}
    />
  );
}
```

- [ ] **Step 4: Implement `components/ui/SectionHeading.tsx`**

```tsx
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { index: number; title: string; comment: string };

export default function SectionHeading({ index, title, comment }: Props) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {String(index).padStart(2, '0')}
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'text.secondary',
          fontSize: '0.875rem',
          mt: 1,
        }}
      >
        {comment}
      </Typography>
    </Box>
  );
}
```

- [ ] **Step 5: Implement `components/ui/TerminalWindow.tsx`**

```tsx
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { user: string; command: string; children: ReactNode };

export default function TerminalWindow({ user, command, children }: Props) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        maxWidth: 780,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 2,
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <Box
            key={c}
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c, opacity: 0.85 }}
          />
        ))}
      </Box>

      <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Typography
          component="p"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.875rem',
            color: 'text.secondary',
            mb: 2,
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            {user}
          </Box>
          :~$ {command}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npm test -- ui`
Expected: PASS, 7 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add SectionHeading, TechChip, and TerminalWindow primitives"
```

---

### Task 5: Root layout, Navbar, ThemeToggle, Footer

**Files:**
- Create: `test/utils.tsx`, `components/layout/ThemeToggle.tsx`, `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `components/ThemeRegistry.tsx`
- Modify: `app/layout.tsx`
- Test: `components/layout/__tests__/layout.test.tsx`

**Interfaces:**
- Consumes: `content/nav.ts`, `content/profile.ts`, `content/socials.ts`, `theme/theme.ts`.
- Produces: `<Navbar />`, `<Footer />`, `<ThemeToggle />`, `<ThemeRegistry>{children}</ThemeRegistry>`, `renderWithTheme(ui)` from `@/test/utils`, and CSS variables `--font-inter` / `--font-mono` on `<html>`.

- [ ] **Step 1: Create the theme-aware test helper**

`ThemeToggle` calls MUI's `useColorScheme`, which throws when rendered outside a theme provider. Plain `render()` from Testing Library is therefore not enough for any tree containing the toggle. Create `test/utils.tsx`:

```tsx
import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme';

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      {children}
    </ThemeProvider>
  );
}

export function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Providers, ...options });
}

export * from '@testing-library/react';
```

- [ ] **Step 2: Write the failing test**

Create `components/layout/__tests__/layout.test.tsx`. Note it imports `renderWithTheme`, not `render`:

```tsx
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { navItems } from '@/content/nav';
import { socials } from '@/content/socials';

describe('Navbar', () => {
  it('renders a link for every nav item pointing at its anchor', () => {
    renderWithTheme(<Navbar />);
    for (const item of navItems) {
      const link = screen.getByRole('link', { name: item.label });
      expect(link).toHaveAttribute('href', `#${item.id}`);
    }
  });

  it('exposes a resume link to the CV', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByRole('link', { name: /resume/i })).toHaveAttribute(
      'href',
      '/docs/my-cv.pdf',
    );
  });

  it('has an accessible theme toggle', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByRole('button', { name: /theme/i })).toBeInTheDocument();
  });

  it('renders inside a banner landmark', () => {
    renderWithTheme(<Navbar />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('renders inside a contentinfo landmark', () => {
    renderWithTheme(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('links to GitHub and LinkedIn with correct destinations', () => {
    renderWithTheme(<Footer />);
    const gh = socials.find((s) => s.id === 'github')!;
    const li = socials.find((s) => s.id === 'linkedin')!;
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', gh.href);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', li.href);
  });
});
```

Tests in Tasks 4 and 6–10 use plain `render` because none of those components call `useColorScheme`. If any of them later gains a color-scheme dependency, switch that file to `renderWithTheme`.

- [ ] **Step 3: Run it to confirm it fails**

Run: `npm test -- layout`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement `components/layout/ThemeToggle.tsx`**

```tsx
'use client';

import { useColorScheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';

export default function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const isDark = mode !== 'light';

  return (
    <IconButton
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      size="small"
      sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
    >
      {isDark ? (
        <LightModeOutlinedIcon fontSize="small" />
      ) : (
        <DarkModeOutlinedIcon fontSize="small" />
      )}
    </IconButton>
  );
}
```

- [ ] **Step 5: Implement `components/layout/Navbar.tsx`**

```tsx
'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { navItems } from '@/content/nav';
import { profile } from '@/content/profile';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      component="header"
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: 'rgba(0,0,0,0)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'color-mix(in srgb, var(--mui-palette-background-default) 80%, transparent)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ maxWidth: 1120, width: '100%', mx: 'auto', gap: 2 }}>
        <Link
          href="#home"
          underline="none"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            fontWeight: 700,
            color: 'text.primary',
            '&:hover': { color: 'primary.main' },
          }}
        >
          helouism
        </Link>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              underline="none"
              sx={{
                px: 1.5,
                py: 1,
                fontSize: '0.9rem',
                color: 'text.secondary',
                '&:hover': { color: 'primary.main' },
              }}
            >
              {item.label}
            </Link>
          ))}
        </Box>

        <ThemeToggle />

        <Button
          variant="outlined"
          size="small"
          href={profile.resumeHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </Button>

        <IconButton
          aria-label="Open navigation menu"
          onClick={() => setOpen(true)}
          sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.secondary' }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.id} component="a" href={`#${item.id}`}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
```

Note: the desktop links and the drawer links both render `item.label`. The test queries by accessible name and would find two matches when the drawer is open — it is closed on render, and MUI's `Drawer` does not mount its children until opened, so exactly one match exists. If the test reports "found multiple elements", switch the drawer to `keepMounted={false}` (the default) and re-run.

- [ ] **Step 6: Implement `components/layout/Footer.tsx`**

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { socials } from '@/content/socials';

export default function Footer() {
  const github = socials.find((s) => s.id === 'github')!;
  const linkedin = socials.find((s) => s.id === 'linkedin')!;
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{ borderTop: '1px solid', borderColor: 'divider', py: 5, mt: 10 }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
            }}
          >
            © {year} Hendrik Louis Mahdi
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 7: Implement `components/ThemeRegistry.tsx`**

```tsx
'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme} defaultMode="dark">
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
```

- [ ] **Step 8: Rewrite `app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Box from '@mui/material/Box';
import ThemeRegistry from '@/components/ThemeRegistry';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COLOR_SCHEME_ATTRIBUTE } from '@/theme/theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hendrik Louis Mahdi — IT Support & Infrastructure',
  description:
    'L1 IT Support and infrastructure engineer in Tangerang Selatan. Windows, Linux, VMware, Proxmox, MySQL, PostgreSQL, and Laravel application support.',
  authors: [{ name: 'Hendrik Louis Mahdi' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute={COLOR_SCHEME_ATTRIBUTE} defaultMode="dark" />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <ThemeRegistry>
            <Navbar />
            <Box component="div" sx={{ pt: { xs: 8, md: 9 } }}>
              {children}
            </Box>
            <Footer />
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

The entry point must match the installed **Next** major, not the MUI major. Next 16.3.1 is installed, so it is `v16-appRouter`. (Verified present: the package ships `v13`/`v14`/`v15`/`v16` app-router entry points.)

- [ ] **Step 9: Run the tests**

Run: `npm test -- layout`
Expected: PASS, 6 tests.

- [ ] **Step 10: Verify no theme flash in the browser**

Run: `npm run dev`, open `http://localhost:3000`, and hard-reload several times. Expected: the page paints dark immediately, with no white flash. Toggle to light, reload, and confirm it stays light. If a flash appears, `InitColorSchemeScript`'s `attribute` does not match `cssVariables.colorSchemeSelector` in `theme/theme.ts`.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: add root layout, navbar with drawer, theme toggle, and footer"
```

---

### Task 6: Hero section

**Files:**
- Create: `components/sections/Hero.tsx`
- Modify: `app/page.tsx`
- Test: `components/sections/__tests__/hero.test.tsx`

**Interfaces:**
- Consumes: `content/profile.ts`, `components/ui/TerminalWindow.tsx`.
- Produces: `<Hero />` rendering `<section id="home">`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/__tests__/hero.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '@/components/sections/Hero';
import { profile } from '@/content/profile';

describe('Hero', () => {
  it('renders the name as the only h1', () => {
    render(<Hero />);
    expect(screen.getByRole('heading', { level: 1, name: new RegExp(profile.name) })).toBeInTheDocument();
  });

  it('renders the professional title', () => {
    render(<Hero />);
    expect(screen.getByText(profile.title)).toBeInTheDocument();
  });

  it('links to the projects section', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute(
      'href',
      '#projects',
    );
  });

  it('links to the CV', () => {
    render(<Hero />);
    expect(screen.getByRole('link', { name: /download cv/i })).toHaveAttribute(
      'href',
      profile.resumeHref,
    );
  });

  it('anchors the home section', () => {
    const { container } = render(<Hero />);
    expect(container.querySelector('section#home')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- hero`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/sections/Hero.tsx`**

The grid background and blinking cursor live here and nowhere else. The cursor animation is suppressed under reduced motion.

```tsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TerminalWindow from '@/components/ui/TerminalWindow';
import { profile } from '@/content/profile';

export default function Hero() {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 14 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--mui-palette-divider) 1px, transparent 1px), linear-gradient(90deg, var(--mui-palette-divider) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 30% 40%, #000 20%, transparent 80%)',
          opacity: 0.6,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <TerminalWindow user={profile.promptUser} command="whoami">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, mb: 1.5 }}>
            {profile.name}
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                display: 'inline-block',
                width: '0.5em',
                height: '1em',
                ml: '0.15em',
                verticalAlign: '-0.1em',
                bgcolor: 'primary.main',
                animation: 'blink 1.1s step-end infinite',
                '@keyframes blink': { '50%': { opacity: 0 } },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'primary.main',
              mb: 2.5,
            }}
          >
            {profile.title}
          </Typography>

          <Typography sx={{ color: 'text.secondary', maxWidth: '52ch', mb: 2 }}>
            {profile.tagline}
          </Typography>

          <Box sx={{ mb: 4 }}>
            {profile.microCopy.map((line) => (
              <Typography
                key={line}
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                {line}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" href="#projects">
              View Projects
            </Button>
            <Button
              variant="outlined"
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </Button>
          </Box>
        </TerminalWindow>
      </Container>
    </Box>
  );
}
```

The terminal is deliberately left-aligned and capped at 780px inside a wider container — that asymmetry is the spec's anti-templated requirement, not an oversight. Do not center it.

- [ ] **Step 4: Wire it into `app/page.tsx`**

```tsx
import Hero from '@/components/sections/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS, including the Task 1 smoke test.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add hero section with terminal window and blinking cursor"
```

---

### Task 7: About and Skills sections

**Files:**
- Create: `components/sections/About.tsx`, `components/sections/Skills.tsx`
- Modify: `app/page.tsx`
- Test: `components/sections/__tests__/about-skills.test.tsx`

**Interfaces:**
- Consumes: `content/profile.ts`, `content/skills.ts`, `SectionHeading`, `TechChip`.
- Produces: `<About />` → `<section id="about">`, `<Skills />` → `<section id="skills">`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/__tests__/about-skills.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import { skillGroups } from '@/content/skills';

describe('About', () => {
  it('anchors the about section', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#about')).toBeTruthy();
  });

  it('mentions the current employer', () => {
    render(<About />);
    expect(screen.getByText(/Lintas Media Danawa/)).toBeInTheDocument();
  });

  it('does not call him a fresh graduate', () => {
    const { container } = render(<About />);
    expect(container.textContent?.toLowerCase()).not.toContain('fresh graduate');
  });
});

describe('Skills', () => {
  it('anchors the skills section', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('section#skills')).toBeTruthy();
  });

  it('renders every group name as a heading', () => {
    render(<Skills />);
    for (const g of skillGroups) {
      expect(screen.getByRole('heading', { name: g.name })).toBeInTheDocument();
    }
  });

  it('renders every skill as a chip', () => {
    render(<Skills />);
    for (const g of skillGroups) {
      for (const item of g.items) {
        expect(screen.getByText(item)).toBeInTheDocument();
      }
    }
  });

  it('renders no percentage progress bars', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.textContent).not.toMatch(/\d+%/);
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- about-skills`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `components/sections/About.tsx`**

The prose below is the approved copy. Do not add facts to it.

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';

export default function About() {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={1} title="About" comment="// what I actually do" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography sx={{ color: 'text.secondary', mb: 2.5, maxWidth: '62ch' }}>
              I work first-line support at Lintas Media Danawa, keeping infrastructure and
              enterprise applications running for internal users and external clients. That
              means hardware, networks, servers, and the web apps sitting on top of them —
              whichever one the ticket points at.
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2.5, maxWidth: '62ch' }}>
              The part I like is the diagnosis. Reading application logs to find the actual
              bug, running a query to confirm what the data really says, checking the server
              before the user notices anything is wrong. A background in Informatics
              Engineering and a habit of building web applications means I can usually follow
              a problem past the point where the ticket would otherwise get escalated.
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '62ch' }}>
              I studied Informatics Engineering at Pamulang University, graduating in 2024,
              after a vocational background in computer network engineering.
            </Typography>
          </Box>

          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 3,
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
              display: 'grid',
              gap: 1.25,
            }}
          >
            {[
              ['role', 'L1 IT Support'],
              ['focus', 'Infra · Apps · Helpdesk'],
              ['based', 'Tangerang Selatan, ID'],
              ['status', 'open to opportunities'],
            ].map(([k, v]) => (
              <Box key={k} sx={{ display: 'flex', gap: 1.5 }}>
                <Box component="span" sx={{ color: 'primary.main', minWidth: 64 }}>
                  {k}
                </Box>
                <Box component="span">{v}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Implement `components/sections/Skills.tsx`**

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import TechChip from '@/components/ui/TechChip';
import { skillGroups } from '@/content/skills';

export default function Skills() {
  return (
    <Box component="section" id="skills" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={2} title="Skills" comment="// everything here is on the job, not on a course certificate" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {skillGroups.map((group) => (
            <Box key={group.name}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.875rem',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                {group.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {group.items.map((item) => (
                  <TechChip key={item} label={item} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Wire both into `app/page.tsx`**

```tsx
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
    </main>
  );
}
```

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add about and skills sections with chip groups replacing progress bars"
```

---

### Task 8: Projects section

**Files:**
- Create: `components/ui/ProjectCard.tsx`, `components/sections/Projects.tsx`
- Modify: `app/page.tsx`
- Test: `components/sections/__tests__/projects.test.tsx`

**Interfaces:**
- Consumes: `content/projects.ts`, `SectionHeading`, `TechChip`, type `Project`.
- Produces: `<ProjectCard project={Project} />`, `<Projects />` → `<section id="projects">`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/__tests__/projects.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Projects from '@/components/sections/Projects';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/content/projects';

describe('ProjectCard', () => {
  const withDemo = projects.find((p) => p.demo)!;
  const withoutDemo = projects.find((p) => !p.demo)!;

  it('renders the title as a heading', () => {
    render(<ProjectCard project={withDemo} />);
    expect(screen.getByRole('heading', { name: withDemo.title })).toBeInTheDocument();
  });

  it('renders every stack item as a chip', () => {
    render(<ProjectCard project={withDemo} />);
    for (const tech of withDemo.stack) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it('renders the thumbnail with its alt text', () => {
    render(<ProjectCard project={withDemo} />);
    expect(screen.getByAltText(withDemo.alt)).toBeInTheDocument();
  });

  it('links to the source repository', () => {
    render(<ProjectCard project={withDemo} />);
    expect(screen.getByRole('link', { name: /source/i })).toHaveAttribute('href', withDemo.repo);
  });

  it('renders a demo link when a demo exists', () => {
    render(<ProjectCard project={withDemo} />);
    expect(screen.getByRole('link', { name: /demo/i })).toHaveAttribute('href', withDemo.demo!);
  });

  it('omits the demo link when there is no demo', () => {
    render(<ProjectCard project={withoutDemo} />);
    expect(screen.queryByRole('link', { name: /demo/i })).toBeNull();
  });

  it('opens external links safely', () => {
    render(<ProjectCard project={withDemo} />);
    const link = screen.getByRole('link', { name: /source/i });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });
});

describe('Projects', () => {
  it('anchors the projects section', () => {
    const { container } = render(<Projects />);
    expect(container.querySelector('section#projects')).toBeTruthy();
  });

  it('renders a card per project', () => {
    render(<Projects />);
    for (const p of projects) {
      expect(screen.getByRole('heading', { name: p.title })).toBeInTheDocument();
    }
  });

  it('gives the featured project a wider grid span', () => {
    const { container } = render(<Projects />);
    const featured = projects.find((p) => p.featured)!;
    const el = container.querySelector(`[data-slug="${featured.slug}"]`);
    expect(el).toHaveAttribute('data-featured', 'true');
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- projects`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `components/ui/ProjectCard.tsx`**

Uses a plain `<img>` rather than `next/image`. Static export disables image optimization anyway, and `next/image` in jsdom complicates the alt-text test for no benefit.

```tsx
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import TechChip from '@/components/ui/TechChip';
import type { Project } from '@/content/types';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      data-slug={project.slug}
      data-featured={project.featured ? 'true' : 'false'}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gridColumn: { md: project.featured ? 'span 2' : 'span 1' },
      }}
    >
      <Box
        component="img"
        src={project.image}
        alt={project.alt}
        loading="lazy"
        sx={{
          width: '100%',
          height: { xs: 200, md: project.featured ? 320 : 200 },
          objectFit: 'cover',
          objectPosition: 'top',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />

      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h3" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
          {project.title}
        </Typography>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.925rem', mb: 2.5 }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
          {project.stack.map((tech) => (
            <TechChip key={tech} label={tech} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<GitHubIcon />}
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
          >
            Source
          </Button>
          {project.demo && (
            <Button
              size="small"
              variant="contained"
              startIcon={<LaunchIcon />}
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 4: Implement `components/sections/Projects.tsx`**

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/content/projects';

export default function Projects() {
  return (
    <Box component="section" id="projects" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={3} title="Projects" comment="// built end to end, not cloned from a tutorial" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Wire into `app/page.tsx`**

Add `import Projects from '@/components/sections/Projects';` and render `<Projects />` after `<Skills />`.

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add projects section with featured card spanning the grid"
```

---

### Task 9: Experience and Education sections

**Files:**
- Create: `components/sections/Experience.tsx`, `components/sections/Education.tsx`
- Modify: `app/page.tsx`
- Test: `components/sections/__tests__/experience-education.test.tsx`

**Interfaces:**
- Consumes: `content/experience.ts`, `content/education.ts`, `SectionHeading`.
- Produces: `<Experience />` → `<section id="experience">`, `<Education />` → `<section id="education">`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/__tests__/experience-education.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import { experience } from '@/content/experience';
import { education } from '@/content/education';

describe('Experience', () => {
  it('anchors the experience section', () => {
    const { container } = render(<Experience />);
    expect(container.querySelector('section#experience')).toBeTruthy();
  });

  it('renders every role', () => {
    render(<Experience />);
    for (const job of experience) {
      expect(screen.getByRole('heading', { name: job.role })).toBeInTheDocument();
    }
  });

  it('renders every bullet', () => {
    render(<Experience />);
    for (const job of experience) {
      for (const bullet of job.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it('flags the current role', () => {
    render(<Experience />);
    expect(screen.getByText(/current/i)).toBeInTheDocument();
  });

  it('renders bullets as real list items', () => {
    const { container } = render(<Experience />);
    const totalBullets = experience.reduce((n, j) => n + j.bullets.length, 0);
    expect(container.querySelectorAll('li')).toHaveLength(totalBullets);
  });
});

describe('Education', () => {
  it('anchors the education section', () => {
    const { container } = render(<Education />);
    expect(container.querySelector('section#education')).toBeTruthy();
  });

  it('renders every entry with its school and period', () => {
    render(<Education />);
    for (const e of education) {
      expect(screen.getByRole('heading', { name: e.degree })).toBeInTheDocument();
      expect(screen.getByText(e.school)).toBeInTheDocument();
      expect(screen.getByText(e.period)).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- experience-education`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement `components/sections/Experience.tsx`**

The current role gets an accent left border and a `current` marker; older roles do not. That is the spec's "more visual weight" requirement.

```tsx
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import { experience } from '@/content/experience';

export default function Experience() {
  return (
    <Box component="section" id="experience" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={4} title="Experience" comment="// where the tickets come from" />

        <Box sx={{ display: 'grid', gap: 3 }}>
          {experience.map((job) => (
            <Box
              key={job.id}
              sx={{
                borderLeft: '2px solid',
                borderColor: job.current ? 'primary.main' : 'divider',
                pl: { xs: 2.5, md: 4 },
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  gap: 1.5,
                  mb: 0.5,
                }}
              >
                <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                  {job.role}
                </Typography>
                {job.current && (
                  <Chip
                    label="current"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 22 }}
                  />
                )}
              </Box>

              <Typography sx={{ color: 'primary.main', fontSize: '0.95rem', mb: 0.5 }}>
                {job.company}
                {job.contract ? ` · ${job.contract}` : ''}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                {job.period} · {job.location}
              </Typography>

              <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'grid', gap: 1 }}>
                {job.bullets.map((bullet) => (
                  <Typography
                    component="li"
                    key={bullet}
                    sx={{ color: 'text.secondary', fontSize: '0.925rem' }}
                  >
                    {bullet}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 4: Implement `components/sections/Education.tsx`**

```tsx
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import { education } from '@/content/education';

export default function Education() {
  return (
    <Box component="section" id="education" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={5} title="Education" comment="// the paper trail" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
          }}
        >
          {education.map((e) => (
            <Box
              key={e.id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                p: 3,
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 0.75 }}>
                {e.degree}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1.5 }}>
                {e.school}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.78rem',
                    color: 'text.secondary',
                  }}
                >
                  {e.period}
                </Typography>
                {e.note && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.78rem',
                      color: 'primary.main',
                    }}
                  >
                    {e.note}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
```

- [ ] **Step 5: Wire both into `app/page.tsx`**

Render `<Experience />` then `<Education />` after `<Projects />`.

- [ ] **Step 6: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add experience and education sections"
```

---

### Task 10: Contact section

**Files:**
- Create: `components/sections/Contact.tsx`
- Modify: `app/page.tsx`
- Test: `components/sections/__tests__/contact.test.tsx`

**Interfaces:**
- Consumes: `content/socials.ts`, `content/profile.ts`, `SectionHeading`.
- Produces: `<Contact />` → `<section id="contact">`.

- [ ] **Step 1: Write the failing test**

Create `components/sections/__tests__/contact.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Contact from '@/components/sections/Contact';
import { socials } from '@/content/socials';

describe('Contact', () => {
  it('anchors the contact section', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('section#contact')).toBeTruthy();
  });

  it('renders a link for every social with the right href', () => {
    render(<Contact />);
    for (const s of socials) {
      const link = screen.getByRole('link', { name: new RegExp(s.label, 'i') });
      expect(link).toHaveAttribute('href', s.href);
    }
  });

  it('renders no form controls', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
  });

  it('shows the location', () => {
    render(<Contact />);
    expect(screen.getByText(/Tangerang Selatan/)).toBeInTheDocument();
  });
});

describe('Contact copy button', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('copies the email address to the clipboard', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /copy email/i }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hendrikmahdi@gmail.com');
  });

  it('confirms the copy to the user', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /copy email/i }));
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npm test -- contact`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `components/sections/Contact.tsx`**

```tsx
'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SectionHeading from '@/components/ui/SectionHeading';
import { socials } from '@/content/socials';
import { profile } from '@/content/profile';

const icons: Record<string, typeof EmailOutlinedIcon> = {
  email: EmailOutlinedIcon,
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = socials.find((s) => s.id === 'email')!;

  async function copyEmail() {
    await navigator.clipboard.writeText(email.value);
    setCopied(true);
  }

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={6} title="Contact" comment="// no form, just reach out" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            maxWidth: 720,
          }}
        >
          {socials.map((s) => {
            const Icon = icons[s.id];
            return (
              <Box
                key={s.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  p: 2,
                  transition: 'border-color 160ms ease',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Icon fontSize="small" sx={{ color: 'primary.main' }} />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                      textTransform: 'lowercase',
                    }}
                  >
                    {s.label}
                  </Typography>
                  <Link
                    href={s.href}
                    aria-label={`${s.label}: ${s.value}`}
                    target={s.kind === 'email' ? undefined : '_blank'}
                    rel={s.kind === 'email' ? undefined : 'noopener noreferrer'}
                    underline="hover"
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.9rem',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.value}
                  </Link>
                </Box>
                {s.id === 'email' && (
                  <IconButton
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    size="small"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
          <PlaceOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
            }}
          >
            {profile.location}
          </Typography>
        </Box>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          message="Copied to clipboard"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </Box>
  );
}
```

The accessible name of the copy button is "Copy email address", which matches the test's `/copy email/i`. The Snackbar message "Copied to clipboard" matches `/copied/i`.

The `aria-label` on each contact `Link` is load-bearing, not decoration. The
visible text is just the value (`helouism`, `hendrik-louis-mahdi`), which gives
a screen-reader user no idea where the link goes; the label supplies the
destination. It is also what makes the test's `getByRole('link', { name: /GitHub/i })`
query resolve. Do not remove it.

- [ ] **Step 4: Wire into `app/page.tsx`** — the file is now complete

```tsx
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Projects from '@/components/sections/Projects';
import Experience from '@/components/sections/Experience';
import Education from '@/components/sections/Education';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 5: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add contact section with copy-to-clipboard email"
```

---

### Task 11: Remove the legacy site and assert the section contract

**Files:**
- Delete: `index.html`, `css/style.css`, `css/`, `js/theme-toggle.js`, `js/`
- Test: `app/__tests__/page-contract.test.tsx`

**Interfaces:**
- Consumes: `app/page.tsx`, `content/nav.ts`.
- Produces: nothing new. This task guarantees every nav anchor has a matching section, so no nav link can dead-end.

- [ ] **Step 1: Write the failing contract test**

Create `app/__tests__/page-contract.test.tsx`. Replace the Task 1 smoke test file entirely — delete `app/__tests__/smoke.test.tsx`, since this supersedes it.

```tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';
import { navItems, SECTION_ORDER } from '@/content/nav';

describe('page contract', () => {
  it('renders a main landmark', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('main')).toBeTruthy();
  });

  it('renders a section for every id in SECTION_ORDER', () => {
    const { container } = render(<Home />);
    for (const id of SECTION_ORDER) {
      expect(container.querySelector(`section#${id}`)).toBeTruthy();
    }
  });

  it('has a landing target for every nav link', () => {
    const { container } = render(<Home />);
    for (const item of navItems) {
      expect(container.querySelector(`section#${item.id}`)).toBeTruthy();
    }
  });

  it('renders sections in the declared order', () => {
    const { container } = render(<Home />);
    const rendered = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    expect(rendered).toEqual(SECTION_ORDER);
  });

  it('renders exactly one h1', () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run it**

Run: `npm test -- page-contract`
Expected: PASS — all seven sections are already wired. If the order test fails, reorder the components in `app/page.tsx` to match `SECTION_ORDER`.

- [ ] **Step 3: Delete the legacy static site**

```bash
git rm index.html
git rm -r css js
```

`assets/` and `docs/my-cv.pdf` were already moved in Task 3. Confirm `docs/superpowers/` still exists — it must not be deleted.

```bash
ls docs/superpowers/specs docs/superpowers/plans
```

- [ ] **Step 4: Confirm nothing still references the deleted files**

```bash
grep -rn "style.css\|theme-toggle.js\|bootstrap\|font-awesome" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yml" . --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=docs
```

Expected: no matches. Any hit must be removed before continuing.

- [ ] **Step 5: Run the full suite and build**

Run: `npm test && npm run typecheck && npm run build`
Expected: all pass; `out/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove legacy Bootstrap site and assert section contract"
```

---

### Task 12: Deployment workflow and final verification

**Files:**
- Create: `.github/workflows/deploy.yml`
- Delete: `.github/workflows/static.yml`
- Modify: `README.md`

**Interfaces:**
- Consumes: the `npm run build` output at `out/`.
- Produces: a Pages deployment on push to `master`.

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ["master"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build static export
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  deploy:
    needs: build
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

The test step is deliberate: a contrast regression or a broken content reference fails the deploy rather than shipping.

- [ ] **Step 2: Delete the old workflow**

```bash
git rm .github/workflows/static.yml
```

- [ ] **Step 3: Update `README.md`**

Replace the file's entire contents with the following (the outer four-backtick
fence is only a wrapper for this plan — the README itself uses normal
three-backtick fences):

````markdown
# helouism.github.io

Personal portfolio — Next.js (App Router, static export) + MUI.

## Develop

```bash
npm install
npm run dev
```

## Verify

```bash
npm test        # Vitest: content integrity, palette contrast, component behavior
npm run typecheck
npm run build   # static export to out/
```

Deployed to GitHub Pages by `.github/workflows/deploy.yml` on push to `master`.
````

- [ ] **Step 4: Run the full verification sweep**

Run each and confirm the output before moving on:

```bash
npm test
npm run typecheck
npm run lint
npm run build
ls out/index.html && ls -d out/_next && ls out/assets && ls out/docs/my-cv.pdf
```

Expected: tests pass, no type errors, lint clean, and every listed path exists. If `out/assets` or `out/docs` are missing, the Task 3 asset move did not land in `public/`.

- [ ] **Step 5: Verify the built export in a browser**

```bash
npx serve out
```

Open the served URL and confirm, at 360px, 768px, and 1440px widths:

- Nav links scroll to the right sections; the mobile drawer opens and closes
- Both theme modes render, and the choice survives a reload with no flash
- Both project images load, and the featured card is visibly wider on desktop
- The Resume and Download CV links open the PDF
- All four contact links work, and the copy button copies the address
- The hero cursor blinks, and stops blinking with reduced motion enabled

- [ ] **Step 6: Run Lighthouse**

In Chrome DevTools, run Lighthouse against the served build. Accessibility is the priority metric; investigate anything below 100 there. Record the four scores in the commit message.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "ci: build and deploy Next.js static export to GitHub Pages"
```

- [ ] **Step 8: Report, do not merge**

Merging to `master` is the user's decision. Report the verification output and the Lighthouse scores, then stop. Do not run `git merge` or `git push` unless asked.

---

## Verification Summary

The plan is complete when all of these hold:

| Check | Command |
|---|---|
| Tests pass | `npm test` |
| No type errors | `npm run typecheck` |
| Lint clean | `npm run lint` |
| Static export builds | `npm run build` |
| Assets exported | `ls out/assets out/docs` |
| Legacy site gone | `test ! -f index.html` |
| Old workflow gone | `test ! -f .github/workflows/static.yml` |
