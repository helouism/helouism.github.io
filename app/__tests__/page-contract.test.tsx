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

  it('numbers each section heading by its position in SECTION_ORDER', () => {
    // Every section hardcodes its own `index` prop, so nothing else stops the page
    // from printing `01 02 03 03 04` once a section is inserted in the middle.
    const { container } = render(<Home />);
    for (const [position, id] of SECTION_ORDER.entries()) {
      // `home` is the hero — it carries no numbered SectionHeading.
      if (id === 'home') continue;
      const heading = container.querySelector(`section#${id} h2`);
      expect(heading, `section#${id} should have an h2`).toBeTruthy();
      const printed = heading!.previousElementSibling?.textContent;
      expect(printed, `section#${id} index`).toBe(String(position).padStart(2, '0'));
    }
  });
});
