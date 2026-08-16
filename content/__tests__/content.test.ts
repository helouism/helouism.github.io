import { describe, it, expect } from 'vitest';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { experience } from '@/content/experience';
import { education } from '@/content/education';
import { skillGroups } from '@/content/skills';
import { socials } from '@/content/socials';
import { navItems, SECTION_ORDER } from '@/content/nav';

describe('projects', () => {
  it('has both projects', () => {
    expect(projects).toHaveLength(2);
  });

  it('gives every project a non-empty stack', () => {
    for (const p of projects) {
      expect(p.stack.length).toBeGreaterThan(0);
    }
  });

  it('gives every project somewhere to go', () => {
    // A card with neither a repo nor a demo is a dead end. `repo` is optional
    // because TheFaucet's source is private, but that must not degrade into
    // "no links at all" for some future project that forgets both.
    for (const p of projects) {
      expect(p.repo ?? p.demo, `${p.title} has no repo and no demo`).toBeDefined();
    }
  });

  it('makes every link it does carry an https URL', () => {
    for (const p of projects) {
      if (p.repo) expect(p.repo).toMatch(/^https:\/\//);
      if (p.demo) expect(p.demo).toMatch(/^https:\/\//);
    }
  });

  it('keeps the private-source project genuinely repo-less rather than blank', () => {
    // An empty string is falsy in the card's `project.repo &&` guard, so it would
    // render the same. It would sail past the https check above, though, and it
    // reads as an unfinished field rather than a decision.
    for (const p of projects) {
      expect(p.repo).not.toBe('');
    }
  });

  it('has unique slugs', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('points every image at a public asset path', () => {
    for (const p of projects) {
      expect(p.image).toMatch(/^\/assets\//);
    }
  });

  it('gives every image non-empty alt text that is not the title of another project', () => {
    const titles = projects.map((p) => p.title);
    for (const p of projects) {
      expect(p.alt.trim().length).toBeGreaterThan(0);
      const otherTitles = titles.filter((t) => t !== p.title);
      expect(otherTitles).not.toContain(p.alt);
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

  it('carries three facts', () => {
    expect(profile.facts).toHaveLength(3);
  });

  it('spends no fact row repeating the hero title', () => {
    expect(profile.facts.map((f) => f.value)).not.toContain(profile.title);
  });

  it('names the current employer, sourced from the experience content', () => {
    // Derived, not retyped: if the current role in `experience.ts` changes, the
    // fact card follows instead of silently going stale.
    const fact = profile.facts.find((f) => f.label === 'current');
    expect(fact).toBeDefined();
    expect(fact!.value).toBe(experience.find((j) => j.current)!.company);
  });

  it('makes no unverified claim about his job-seeking status', () => {
    const blob = JSON.stringify(profile.facts).toLowerCase();
    expect(profile.facts.map((f) => f.label)).not.toContain('status');
    expect(blob).not.toContain('opportunit');
    expect(blob).not.toContain('open to');
  });
});

describe('education', () => {
  it('has both entries', () => {
    expect(education).toHaveLength(2);
  });
});
