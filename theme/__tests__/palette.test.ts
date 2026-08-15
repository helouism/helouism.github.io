import { describe, it, expect } from 'vitest';
import { contrastRatio } from '@/theme/contrast';
import { palette } from '@/theme/palette';
import theme from '@/theme/theme';

const AA_NORMAL = 4.5;
const AA_LARGE = 3;

describe('dark scheme contrast', () => {
  const s = palette.dark;

  it('body text passes AA on the page background', () => {
    expect(contrastRatio(s.text, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('secondary text passes AA on the page background', () => {
    expect(contrastRatio(s.textSecondary, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('accent passes AA on the page background', () => {
    expect(contrastRatio(s.accent, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('body text passes AA on raised surfaces', () => {
    expect(contrastRatio(s.text, s.paper)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('light scheme contrast', () => {
  const s = palette.light;

  it('body text passes AA on the page background', () => {
    expect(contrastRatio(s.text, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('secondary text passes AA on the page background', () => {
    expect(contrastRatio(s.textSecondary, s.bg)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('accent passes AA as text on white surfaces', () => {
    expect(contrastRatio(s.accent, '#FFFFFF')).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('white text on an accent-filled button passes AA', () => {
    expect(contrastRatio('#FFFFFF', s.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('palette regressions', () => {
  it('rejects the bright green as a light-mode accent', () => {
    expect(contrastRatio('#00E676', '#FFFFFF')).toBeLessThan(AA_LARGE);
  });
});

describe('accent-filled button contrast', () => {
  it('dark scheme: accentContrast text on accent background passes AA', () => {
    const s = palette.dark;
    expect(contrastRatio(s.accentContrast, s.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
  });

  it('light scheme: accentContrast text on accent background passes AA', () => {
    const s = palette.light;
    expect(contrastRatio(s.accentContrast, s.accent)).toBeGreaterThanOrEqual(AA_NORMAL);
  });
});

describe('theme secondary alias', () => {
  it('dark scheme: secondary.main equals primary.main', () => {
    expect(theme.colorSchemes?.dark?.palette?.secondary?.main).toBe(
      theme.colorSchemes?.dark?.palette?.primary?.main,
    );
  });

  it('light scheme: secondary.main equals primary.main', () => {
    expect(theme.colorSchemes?.light?.palette?.secondary?.main).toBe(
      theme.colorSchemes?.light?.palette?.primary?.main,
    );
  });
});
