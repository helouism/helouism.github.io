import { describe, it, expect } from 'vitest';
import { contrastRatio } from '@/theme/contrast';

describe('contrastRatio', () => {
  it('returns 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 1);
  });

  it('returns 1 for a color against itself', () => {
    expect(contrastRatio('#00E676', '#00E676')).toBeCloseTo(1, 5);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#123456', '#FEDCBA')).toBeCloseTo(
      contrastRatio('#FEDCBA', '#123456'),
      5,
    );
  });

  it('expands three-digit hex', () => {
    expect(contrastRatio('#000', '#FFF')).toBeCloseTo(21, 1);
  });
});
