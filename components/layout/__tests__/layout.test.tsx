import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import About from '@/components/sections/About';
import { navItems } from '@/content/nav';
import { socials } from '@/content/socials';

// The alignment invariant is expressed as "same Container configuration", not as a
// pixel value: `maxWidth="lg"` resolves through the theme's breakpoints, so a theme
// change moves both the navbar and the sections together and this stays true.
function containerMaxWidthOf(root: Element | null): string | null {
  const container = root?.querySelector('.MuiContainer-root');
  if (!container) return null;
  return (
    Array.from(container.classList).find((c) => c.startsWith('MuiContainer-maxWidth')) ?? null
  );
}

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

  it('constrains its content with the same Container as the page sections', () => {
    const nav = renderWithTheme(<Navbar />);
    const section = renderWithTheme(<About />);

    const navMaxWidth = containerMaxWidthOf(nav.container.querySelector('header'));
    const sectionMaxWidth = containerMaxWidthOf(section.container.querySelector('section#about'));

    expect(sectionMaxWidth).not.toBeNull();
    expect(navMaxWidth).toBe(sectionMaxWidth);
  });

  it('does not double the section gutters with the Toolbar padding', () => {
    // The Container supplies the horizontal padding; a Toolbar that also keeps its
    // own gutters would push the brand inward at small widths — the same
    // misalignment bug, just pointing the other way.
    const { container } = renderWithTheme(<Navbar />);
    const toolbar = container.querySelector('.MuiToolbar-root');
    expect(toolbar).toBeTruthy();
    expect(toolbar!.classList.contains('MuiToolbar-gutters')).toBe(false);
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
