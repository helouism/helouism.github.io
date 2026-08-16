import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    name: 'Support & Operations',
    items: [
      'L1 Helpdesk',
      'ServiceDesk Plus',
      'eBesha CRM',
      'SLA Management',
      'Incident Triage',
      'Escalation (L2/L3)',
      'Server/Network/App Monitoring',
    ],
  },
  {
    name: 'Systems & Infrastructure',
    items: [
      'Windows',
      'Linux',
      'macOS',
      'VMware',
      'Proxmox',
      'SSH/FTP/SFTP',
      'TCP/IP',
      'Routers & Switches',
      'Firewall Config',
      'Hardware & Software Support',
    ],
  },
  {
    name: 'Databases',
    items: ['MySQL', 'PostgreSQL', 'SQL', 'Navicat'],
  },
  {
    name: 'Development',
    items: [
      'PHP',
      'Laravel',
      'CodeIgniter 4',
      'JavaScript',
      'React',
      'Python',
      'Git',
      'Log Analysis & Debugging',
    ],
  },
];
