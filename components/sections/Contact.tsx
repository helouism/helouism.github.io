'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import SectionHeading from '@/components/ui/SectionHeading';
import { socials } from '@/content/socials';
import { profile } from '@/content/profile';

const icons: Record<string, typeof EmailOutlinedIcon> = {
  email: EmailOutlinedIcon,
  whatsapp: WhatsAppIcon,
  linkedin: LinkedInIcon,
  github: GitHubIcon,
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = socials.find((s) => s.id === 'email')!;

  async function copyEmail() {
    await navigator.clipboard.writeText(email.value);
    setCopied(true);
  }

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={6} title="Contact" comment="// no form, just reach out" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: 2,
            maxWidth: 720,
          }}
        >
          {socials.map((s) => {
            const Icon = icons[s.id];
            return (
              <Box
                key={s.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  p: 2,
                  transition: 'border-color 160ms ease',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              >
                <Icon fontSize="small" sx={{ color: 'primary.main' }} />
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.7rem',
                      color: 'text.secondary',
                      textTransform: 'lowercase',
                    }}
                  >
                    {s.label}
                  </Typography>
                  <Link
                    href={s.href}
                    aria-label={`${s.label}: ${s.value}`}
                    target={s.kind === 'email' ? undefined : '_blank'}
                    rel={s.kind === 'email' ? undefined : 'noopener noreferrer'}
                    underline="hover"
                    sx={{
                      color: 'text.primary',
                      fontSize: '0.9rem',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.value}
                  </Link>
                </Box>
                {s.id === 'email' && (
                  <IconButton
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    size="small"
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  >
                    <ContentCopyIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
          <PlaceOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
            }}
          >
            {profile.location}
          </Typography>
        </Box>

        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => setCopied(false)}
          message="Copied to clipboard"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Container>
    </Box>
  );
}
