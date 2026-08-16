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

      if (s.kind === 'email') {
        // A `mailto:` handoff stays in place; a new tab would just be an empty one.
        expect(link).not.toHaveAttribute('target');
        expect(link).not.toHaveAttribute('rel');
      } else {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      }
    }
  });

  it('links LinkedIn to the LinkedIn profile, not GitHub', () => {
    // Pinned to the literal on purpose. Every other href assertion derives its
    // expectation from `content/socials.ts`, so the old site's mistake — LinkedIn
    // pointing at a GitHub URL — could regress there with the suite still green.
    render(<Contact />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/hendrik-louis-mahdi-b0ba67178/',
    );
  });

  it('renders no form controls', () => {
    const { container } = render(<Contact />);
    expect(container.querySelector('form')).toBeNull();
    expect(container.querySelector('input')).toBeNull();
    expect(container.querySelector('textarea')).toBeNull();
    expect(container.querySelector('select')).toBeNull();
    expect(container.querySelector('button[type="submit"]')).toBeNull();
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

  it('tells the user when the copy fails', async () => {
    // A denied permission — or a non-secure context, where reading
    // `navigator.clipboard` itself throws — must still reach the user, not just
    // a sighted one who can select the address manually.
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('denied'));

    render(<Contact />);
    await user.click(screen.getByRole('button', { name: /copy email/i }));

    expect(await screen.findByText(/copy failed/i)).toBeInTheDocument();
  });

  it('re-announces on a repeat click inside the autohide window', async () => {
    // Setting the same state value is a no-op, so without a remount the live
    // region never changes and assistive tech stays silent on the second click.
    const user = userEvent.setup();
    render(<Contact />);
    const button = screen.getByRole('button', { name: /copy email/i });

    await user.click(button);
    const first = await screen.findByRole('alert');

    await user.click(button);
    const second = await screen.findByRole('alert');

    expect(second).not.toBe(first);
    expect(second).toHaveTextContent(/copied/i);
  });
});
