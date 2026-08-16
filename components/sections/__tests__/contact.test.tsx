import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Contact from '@/components/sections/Contact';
import { socials } from '@/content/socials';

describe('Contact', () => {
  it('anchors the contact section', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('section#contact')).toBeTruthy();
  });

  it('renders a link for every social with the right href', () => {
    render(<Contact />);
    for (const s of socials) {
      const link = screen.getByRole('link', { name: new RegExp(s.label, 'i') });
      expect(link).toHaveAttribute('href', s.href);
    }
  });

  it('renders no form controls', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
  });

  it('shows the location', () => {
    render(<Contact />);
    expect(screen.getByText(/Tangerang Selatan/)).toBeInTheDocument();
  });
});

describe('Contact copy button', () => {
  it('copies the email address to the clipboard', async () => {
    // `userEvent.setup()` installs its own clipboard stub over `navigator.clipboard`,
    // so the spy has to be attached after setup — otherwise it gets clobbered. Spying
    // (rather than replacing) keeps the stub's real implementation, so the text is
    // genuinely written and can be read back below.
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText');

    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /copy email/i }));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('hendrikmahdi@gmail.com');
    await expect(navigator.clipboard.readText()).resolves.toBe('hendrikmahdi@gmail.com');
  });

  it('confirms the copy to the user', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /copy email/i }));
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
