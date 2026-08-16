import type { Profile } from './types';

const title = 'IT Support & Infrastructure';

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
  facts: [
    { label: 'role', value: title },
    { label: 'focus', value: 'Infra · Apps · Helpdesk' },
    { label: 'based', value: 'Tangerang Selatan, ID' },
    { label: 'status', value: 'open to opportunities' },
  ],
};
