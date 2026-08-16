import { render, screen } from '@testing-library/react';
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

  it('gives each project a distinguishable source link for assistive tech', () => {
    render(<Projects />);
    for (const project of projects) {
      const links = screen.getAllByRole('link', { name: `Source code for ${project.title}` });
      expect(links).toHaveLength(1);
      expect(links[0]).toHaveAttribute('href', project.repo);
    }
  });
});
