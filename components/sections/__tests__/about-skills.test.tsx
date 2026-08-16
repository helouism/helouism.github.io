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
