export type Profile = {
  name: string;
  title: string;
  tagline: string;
  microCopy: string[];
  location: string;
  promptUser: string;
  resumeHref: string;
  facts: { label: string; value: string }[];
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  stack: string[];
  repo: string;
  demo?: string;
  featured: boolean;
};

export type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  contract?: string;
  bullets: string[];
  current: boolean;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
  note?: string;
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type Social = {
  id: string;
  label: string;
  value: string;
  href: string;
  kind: 'email' | 'phone' | 'link';
};

export type NavItem = {
  id: string;
  label: string;
};
