import type { Project } from './types';

export const projects: Project[] = [
  {
    slug: 'rekomendasi-laptop',
    title: 'Laptop Recommender System',
    description:
      'A full-stack web application that recommends laptops based on user preferences and requirements, scoring candidates against weighted criteria.',
    image: '/assets/laptop-screenshot.webp',
    alt: 'Screenshot of the Laptop Recommender System interface',
    stack: ['JavaScript', 'jQuery', 'PHP', 'Bootstrap', 'MySQL'],
    repo: 'https://github.com/helouism/rekomendasi-laptop',
    demo: 'https://blegasul.serv00.net/',
    featured: true,
  },
  {
    slug: 'helouism-blog',
    title: 'Simple Blog',
    description:
      'A blog application built on CodeIgniter 4 with Shield authentication, post and category management, a rich-text editor, and sharing to Facebook and X.',
    image: '/assets/helouism-blog.webp',
    alt: 'Screenshot of the Simple Blog admin interface',
    stack: [
      'CodeIgniter 4',
      'CodeIgniter Shield',
      'PHP',
      'JavaScript',
      'QuillJS',
      'jQuery',
      'Bootstrap 5',
      'SweetAlert2',
      'MySQL',
    ],
    repo: 'https://github.com/helouism/helouism-blog',
    featured: false,
  },
];
