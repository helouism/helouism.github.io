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
    expect(container.querySelectorAll('ul li')).toHaveLength(totalBullets);
  });

  it('renders the company, contract, period and location of every role', () => {
    render(<Experience />);
    for (const job of experience) {
      const companyLine = job.contract ? `${job.company} · ${job.contract}` : job.company;
      expect(screen.getByText((_, el) => el?.textContent === companyLine && el.tagName === 'P'))
        .toBeInTheDocument();
      const metaLine = `${job.period} · ${job.location}`;
      expect(screen.getByText((_, el) => el?.textContent === metaLine && el.tagName === 'P'))
        .toBeInTheDocument();
    }
  });

  it('renders the summary of every role that has one', () => {
    render(<Experience />);
    const summarised = experience.filter((j) => j.summary);
    expect(summarised.length).toBeGreaterThan(0);
    for (const job of summarised) {
      expect(screen.getByText(job.summary!)).toBeInTheDocument();
    }
  });

  it('flags exactly one entry as current and renders it first', () => {
    const { container } = render(<Experience />);
    const entries = Array.from(container.querySelectorAll('ol > li'));
    const flagged = entries.filter((el) => el.getAttribute('data-current') === 'true');
    expect(flagged).toHaveLength(1);
    expect(entries[0]).toBe(flagged[0]);
    for (const el of entries.slice(1)) {
      expect(el.hasAttribute('data-current')).toBe(false);
    }
  });

  it('renders the roles as a semantic list', () => {
    const { container } = render(<Experience />);
    const list = container.querySelector('section#experience ol');
    expect(list).toBeTruthy();
    expect(list!.querySelectorAll(':scope > li')).toHaveLength(experience.length);
    expect(list).toHaveAttribute('role', 'list');
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

  it('renders the note of every entry that has one', () => {
    render(<Education />);
    const noted = education.filter((e) => e.note);
    expect(noted.length).toBeGreaterThan(0);
    for (const e of noted) {
      expect(screen.getByText(e.note!)).toBeInTheDocument();
    }
  });

  it('renders the entries as a semantic list', () => {
    const { container } = render(<Education />);
    const list = container.querySelector('section#education ul');
    expect(list).toBeTruthy();
    expect(list!.querySelectorAll(':scope > li')).toHaveLength(education.length);
    expect(list).toHaveAttribute('role', 'list');
  });

  it('renders the description of every entry that has one', () => {
    render(<Education />);
    const described = education.filter((e) => e.description);
    expect(described.length).toBeGreaterThan(0);
    for (const e of described) {
      expect(screen.getByText(e.description!)).toBeInTheDocument();
    }
  });
});
