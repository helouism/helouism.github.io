import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TerminalWindow from '@/components/ui/TerminalWindow';
import { profile } from '@/content/profile';

export default function Hero() {
  return (
    <Box
      component="section"
      id="home"
      sx={{
        position: 'relative',
        py: { xs: 8, md: 14 },
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(var(--mui-palette-divider) 1px, transparent 1px), linear-gradient(90deg, var(--mui-palette-divider) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 30% 40%, #000 20%, transparent 80%)',
          opacity: 0.6,
          pointerEvents: 'none',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <TerminalWindow user={profile.promptUser} command="whoami">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.25rem', md: '3.5rem' }, mb: 1.5 }}>
            {profile.name}
            <Box
              component="span"
              aria-hidden="true"
              sx={{
                display: 'inline-block',
                width: '0.5em',
                height: '1em',
                ml: '0.15em',
                verticalAlign: '-0.1em',
                bgcolor: 'primary.main',
                animation: 'blink 1.1s step-end infinite',
                '@keyframes blink': { '50%': { opacity: 0 } },
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            />
          </Typography>

          <Typography
            variant="h2"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: { xs: '1rem', md: '1.25rem' },
              color: 'primary.main',
              mb: 2.5,
            }}
          >
            {profile.title}
          </Typography>

          <Typography sx={{ color: 'text.secondary', maxWidth: '52ch', mb: 2 }}>
            {profile.tagline}
          </Typography>

          <Box sx={{ mb: 4 }}>
            {profile.microCopy.map((line) => (
              <Typography
                key={line}
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.8rem',
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                {line}
              </Typography>
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button variant="contained" href="#projects">
              View Projects
            </Button>
            <Button
              variant="outlined"
              href={profile.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Download CV
            </Button>
          </Box>
        </TerminalWindow>
      </Container>
    </Box>
  );
}
