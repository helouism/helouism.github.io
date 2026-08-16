import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Projects from '@/components/sections/Projects';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/content/projects';
import type { Project } from '@/content/types';

// The conditional branches are exercised against fixtures rather than whichever
// real project happens to have a demo or a repo today. Content churn should not
// be able to silently delete coverage of a rendering branch.
const fixture = (over: Partial<Project> = {}): Project => ({
  slug: 'fixture',
  title: 'Fixture Project',
  description: 'A fixture.',
  image: '/assets/omnilog.webp',
  alt: 'Screenshot of the fixture',
  stack: ['TypeScript'],
  repo: 'https://github.com/helouism/fixture',
  ...over,
});

describe('ProjectCard', () => {
  const withDemo = projects.find((p) => p.demo)!;

  it('shows a private-source note instead of a dead Source control when there is no repo', () => {
    const closedSource = fixture({ title: 'Closed Source', repo: undefined });
    render(<ProjectCard project={closedSource} />);

    // Both roles: dropping the href turns the MUI Button into a `button`, so a
    // link-only assertion would pass while a dead control still sat on the card.
    expect(screen.queryByRole('link', { name: /source code for/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /source code for/i })).toBeNull();
    expect(screen.getByText(/source private/i)).toBeInTheDocument();
  });

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
    render(<ProjectCard project={fixture({ demo: undefined })} />);
    expect(screen.queryByRole('link', { name: /demo/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /demo/i })).toBeNull();
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

  it('lays every card out identically', () => {
    // Equal cards means one shared `sx`, and one shared `sx` means emotion emits
    // a single class for all of them. So class equality is the assertion: any
    // per-project layout branch — a wider grid span, a taller image — forks the
    // generated class name, and this catches it without having to name the
    // property that carries the hierarchy. A `not.toMatch('span 2')` check would
    // not; it stays green if the span moves to some other property.
    const { container } = render(<Projects />);
    const cards = Array.from(container.querySelectorAll('[data-slug]'));
    expect(cards).toHaveLength(projects.length);
    expect(new Set(cards.map((c) => c.className)).size, 'card classes').toBe(1);

    const images = cards.map((c) => c.querySelector('img')!);
    expect(images.every(Boolean)).toBe(true);
    expect(new Set(images.map((i) => i.className)).size, 'image classes').toBe(1);
  });

  it('renders the cards as a semantic list', () => {
    const { container } = render(<Projects />);
    const list = container.querySelector('section#projects ul');
    expect(list).toBeTruthy();
    expect(list!.querySelectorAll(':scope > li')).toHaveLength(projects.length);
    expect(list).toHaveAttribute('role', 'list');
  });

  it('gives each open-source project a distinguishable source link for assistive tech', () => {
    render(<Projects />);
    const open = projects.filter((p) => p.repo);
    expect(open.length).toBeGreaterThan(0);
    for (const project of open) {
      const links = screen.getAllByRole('link', { name: `Source code for ${project.title}` });
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', project.repo);
    }
  });

  it('leaves no Source control at all on a project whose source is private', () => {
    render(<Projects />);
    for (const project of projects.filter((p) => !p.repo)) {
      const name = `Source code for ${project.title}`;
      expect(screen.queryByRole('link', { name })).toBeNull();
      expect(screen.queryByRole('button', { name })).toBeNull();
    }
  });
});
