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
