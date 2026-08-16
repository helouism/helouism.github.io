import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { socials } from '@/content/socials';

export default function Footer() {
  const github = socials.find((s) => s.id === 'github')!;
  const linkedin = socials.find((s) => s.id === 'linkedin')!;
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{ borderTop: '1px solid', borderColor: 'divider', py: 5, mt: 10 }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
            }}
          >
            © {year} Hendrik Louis Mahdi
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              component="a"
              href={github.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton
              component="a"
              href={linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
