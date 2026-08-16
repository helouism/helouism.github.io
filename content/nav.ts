import type { NavItem } from './types';

export const navItems: NavItem[] = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

export const SECTION_ORDER = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'education',
  'contact',
];
