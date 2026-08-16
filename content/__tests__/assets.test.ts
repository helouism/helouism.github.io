// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projects } from '@/content/projects';
import { profile } from '@/content/profile';

const publicDir = join(process.cwd(), 'public');

describe('referenced files exist on disk', () => {
  it('has every project image in public/', () => {
    for (const p of projects) {
      expect(existsSync(join(publicDir, p.image))).toBe(true);
    }
  });

  it('has the CV in public/', () => {
    expect(existsSync(join(publicDir, profile.resumeHref))).toBe(true);
  });

  it('has the .nojekyll marker', () => {
    expect(existsSync(join(publicDir, '.nojekyll'))).toBe(true);
  });
});
