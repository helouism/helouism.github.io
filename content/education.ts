import type { Education } from './types';

export const education: Education[] = [
  {
    id: 'pamulang',
    degree: 'Bachelor of Informatics Engineering',
    school: 'Pamulang University — South Tangerang, Indonesia',
    period: '2020 — 2024',
    note: 'GPA 3.62',
  },
  {
    id: 'prima-unggul',
    degree: 'Computer Network Engineering',
    school: 'Prima Unggul Vocational High School — South Tangerang, Indonesia',
    period: '2016 — 2019',
    // Verbatim from the previous site; it is the earliest evidence for the
    // infrastructure positioning the rest of the page rests on.
    description:
      'Specialized in computer networking technologies, IT fundamentals, and technical infrastructure management.',
  },
];
