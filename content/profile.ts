import type { Profile } from './types';
import { experience } from './experience';

const title = 'IT Support & Infrastructure';

// Derived from the experience content instead of retyped, so the About fact card
// cannot drift from the Experience section. `experience.ts` imports nothing but
// types, so this direction of the dependency introduces no cycle.
const currentEmployer = experience.find((job) => job.current)!.company;

export const profile: Profile = {
  name: 'Hendrik Louis Mahdi',
  title,
  tagline:
    'L1 support for infrastructure, applications, and the people who depend on both.',
  microCopy: [
    '// I read the logs before I reassign the ticket',
    '// Windows, Linux, macOS — whichever one is on fire',
  ],
  location: 'Tangerang Selatan, Banten, Indonesia',
  promptUser: 'hendrik@infra',
  resumeHref: '/docs/my-cv.pdf',
  // Three rows, each of which says something the hero does not: no `role` row
  // echoing the hero title back, and no claim about job-seeking status — that was
  // never stated and is not ours to assert.
  facts: [
    { label: 'current', value: currentEmployer },
    { label: 'focus', value: 'Infra · Apps · Helpdesk' },
    { label: 'based', value: 'Tangerang Selatan, ID' },
  ],
};
