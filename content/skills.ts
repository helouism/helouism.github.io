import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  {
    name: 'Support & Operations',
    items: [
      'L1 Helpdesk',
      'ServiceNow',
      'ServiceDesk Plus',
      'eBesha CRM',
      'SLA Management',
      'Incident Triage',
      'Escalation (L2/L3)',
      'Server/Network/App Monitoring',
      'Grafana',
      'Prometheus',
      'PRTG',
      'SolarWinds',
      'Pandora FMS',
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
    items: ['MySQL', 'PostgreSQL', 'SQLite', 'Oracle', 'SQL', 'Navicat', 'DBeaver'],
  },
  {
    name: 'Development',
    items: [
      'HTML/CSS',
      'PHP',
      'Laravel',
      'CodeIgniter 4',
      'JavaScript',
      'React',
      'Python',
      'Django',
      'Git',
      'Log Analysis & Debugging',
    ],
  },
];
