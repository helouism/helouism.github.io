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
  // Optional: not every shipped project has public source. Omitting it is a
  // deliberate statement the card renders ("Source private"), not a gap —
  // an empty string here would render a dead button instead.
  repo?: string;
  demo?: string;
};

export type Job = {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  contract?: string;
  summary?: string;
  bullets: string[];
  current: boolean;
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  period: string;
  // `note` is the short badge beside the years (a GPA); `description` is prose.
  note?: string;
  description?: string;
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
