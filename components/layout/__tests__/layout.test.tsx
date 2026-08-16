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
