import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'omnilog',
    title: 'OmniLog',
    description:
      'Privacy-first log analytics that runs 100% in your browser. Parse and visualize NGINX, Apache, UFW & Syslog files up to 100 GB — zero uploads, zero telemetry.',
    image: '/assets/omnilog.webp',
    alt: 'Screenshot of the OmniLog home page with its drag-and-drop log file drop zone',
    stack: [
      'React 19',
      'TypeScript 6',
      'Vite 8',
      'React Router 6',
      'Chart.js 4',
      'TanStack Virtual',
      'Bootstrap 5.3',
      'Workbox PWA',
      'IndexedDB',
    ],
    repo: 'https://github.com/helouism/omnilog',
    demo: 'https://omnilog.my.id',
  },
  {
    slug: 'thefaucet',
    title: 'TheFaucet',
    description:
      'A cryptocurrency faucet platform built with Laravel, Filament, and Livewire. Users earn rewards through timed claims, daily bonuses, referrals, and can withdraw through FaucetPay.',
    image: '/assets/thefaucet.webp',
    alt: 'Screenshot of the TheFaucet landing page showing the claim, level, and withdraw features',
    stack: [
      'Laravel 12',
      'PHP 8.4',
      'Livewire 3',
      'Alpine.js 3',
      'Tailwind CSS 4',
      'Filament 3',
      'PostgreSQL 17',
      'Redis 7',
      'Laravel Reverb',
      'FaucetPay API',
    ],
    // No `repo`: the source is private. See the Project type.
    demo: 'https://thefaucet.net/',
  },
];
