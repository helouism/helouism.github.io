import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from '@/app/page';
import { navItems, SECTION_ORDER } from '@/content/nav';

describe('page contract', () => {
  it('renders a main landmark', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('main')).toBeTruthy();
  });

  it('renders a section for every id in SECTION_ORDER', () => {
    const { container } = render(<Home />);
    for (const id of SECTION_ORDER) {
      expect(container.querySelector(`section#${id}`)).toBeTruthy();
    }
  });

  it('has a landing target for every nav link', () => {
    const { container } = render(<Home />);
    for (const item of navItems) {
      expect(container.querySelector(`section#${item.id}`)).toBeTruthy();
    }
  });

  it('renders sections in the declared order', () => {
    const { container } = render(<Home />);
    const rendered = Array.from(container.querySelectorAll('section[id]')).map((s) => s.id);
    expect(rendered).toEqual(SECTION_ORDER);
  });

  it('renders exactly one h1', () => {
    const { container } = render(<Home />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });
});
