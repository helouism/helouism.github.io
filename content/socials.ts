import type { Social } from './types';

export const socials: Social[] = [
  {
    id: 'email',
    label: 'Email',
    value: 'hendrikmahdi@gmail.com',
    href: 'mailto:hendrikmahdi@gmail.com',
    kind: 'email',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+62 851-5656-1231',
    href: 'https://wa.me/6285156561231',
    kind: 'phone',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'hendrik-louis-mahdi',
    href: 'https://www.linkedin.com/in/hendrik-louis-mahdi-b0ba67178/',
    kind: 'link',
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'helouism',
    href: 'https://github.com/helouism',
    kind: 'link',
  },
];
