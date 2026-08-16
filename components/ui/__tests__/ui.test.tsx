import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SectionHeading from '@/components/ui/SectionHeading';
import TechChip from '@/components/ui/TechChip';
import TerminalWindow from '@/components/ui/TerminalWindow';

describe('SectionHeading', () => {
  it('renders the title as a level-2 heading', () => {
    render(<SectionHeading index={2} title="Projects" comment="// things I built" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Projects' })).toBeInTheDocument();
  });

  it('zero-pads the index', () => {
    render(<SectionHeading index={3} title="Skills" comment="// what I use" />);
    expect(screen.getByText('03')).toBeInTheDocument();
  });

  it('renders the comment', () => {
    render(<SectionHeading index={1} title="About" comment="// who I am" />);
    expect(screen.getByText('// who I am')).toBeInTheDocument();
  });
});

describe('TechChip', () => {
  it('renders its label', () => {
    render(<TechChip label="PostgreSQL" />);
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });
});

describe('TerminalWindow', () => {
  it('renders the prompt with the user and command', () => {
    render(
      <TerminalWindow user="hendrik@infra" command="whoami">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(screen.getByText(/hendrik@infra/)).toBeInTheDocument();
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
  });

  it('renders its children', () => {
    render(
      <TerminalWindow user="u" command="c">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(screen.getByText('output')).toBeInTheDocument();
  });

  it('hides decorative chrome from assistive tech', () => {
    const { container } = render(
      <TerminalWindow user="u" command="c">
        <p>output</p>
      </TerminalWindow>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
