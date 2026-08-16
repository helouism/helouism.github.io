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
