import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import { profile } from '@/content/profile';
import { skillGroups } from '@/content/skills';

describe('About', () => {
  it('anchors the about section', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#about')).toBeTruthy();
  });

  it('mentions the current employer in the prose', () => {
    // Scoped to the paragraphs: the fact card now names the employer too, so an
    // unscoped match would find two nodes. Still fails if the prose drops it.
    const { container } = render(<About />);
    const prose = Array.from(container.querySelectorAll('section#about p'))
      .map((p) => p.textContent)
      .join(' ');
    expect(prose).toMatch(/Lintas Media Danawa/);
  });

  it('does not call him a fresh graduate', () => {
    const { container } = render(<About />);
    expect(container.textContent?.toLowerCase()).not.toContain('fresh graduate');
  });

  it('renders every fact from the content layer', () => {
    render(<About />);
    for (const fact of profile.facts) {
      expect(screen.getByText(fact.label)).toBeInTheDocument();
      expect(screen.getByText(fact.value)).toBeInTheDocument();
    }
  });

  it('renders the fact card as a definition list', () => {
    const { container } = render(<About />);
    expect(container.querySelector('dl')).toBeTruthy();
    expect(container.querySelectorAll('dt')).toHaveLength(profile.facts.length);
    expect(container.querySelectorAll('dd')).toHaveLength(profile.facts.length);
  });

  it('renders three fact rows and does not echo the hero title back', () => {
    // Pinned to the literal 3 on purpose: the assertion above derives its count
    // from the same array it is checking, so it would stay green if a row were
    // added back.
    const { container } = render(<About />);
    expect(container.querySelectorAll('dd')).toHaveLength(3);
    expect(screen.queryByText(profile.title)).toBeNull();
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

  it('renders the groups as a semantic list', () => {
    const { container } = render(<Skills />);
    const list = container.querySelector('section#skills ul');
    expect(list).toBeTruthy();
    expect(list!.querySelectorAll(':scope > li')).toHaveLength(skillGroups.length);
    // Explicit: the marker suppression that makes this look like a grid also
    // strips the implicit list role in WebKit.
    expect(list).toHaveAttribute('role', 'list');
  });

  it('renders no percentage progress bars', () => {
    const { container } = render(<Skills />);
    expect(container.querySelector('[role="progressbar"]')).toBeNull();
    expect(container.textContent).not.toMatch(/\d+%/);
  });
});
