import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import { profile } from '@/content/profile';

export default function About() {
  return (
    <Box component="section" id="about" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={1} title="About" comment="// what I actually do" />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
            gap: { xs: 4, md: 8 },
            alignItems: 'start',
          }}
        >
          <Box>
            <Typography sx={{ color: 'text.secondary', mb: 2.5, maxWidth: '62ch' }}>
              I work first-line support at Lintas Media Danawa, keeping infrastructure and
              enterprise applications running for internal users and external clients. That
              means hardware, networks, servers, and the web apps sitting on top of them —
              whichever one the ticket points at.
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2.5, maxWidth: '62ch' }}>
              The part I like is the diagnosis. Reading application logs to find the actual
              bug, running a query to confirm what the data really says, checking the server
              before the user notices anything is wrong. A background in Informatics
              Engineering and a habit of building web applications means I can usually follow
              a problem past the point where the ticket would otherwise get escalated.
            </Typography>
            <Typography sx={{ color: 'text.secondary', maxWidth: '62ch' }}>
              I studied Informatics Engineering at Pamulang University, graduating in 2024,
              after a vocational background in computer network engineering.
            </Typography>
          </Box>

          <Box
            component="dl"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 3,
              m: 0,
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '0.8rem',
              color: 'text.secondary',
              display: 'grid',
              gap: 1.25,
            }}
          >
            {profile.facts.map((fact) => (
              <Box key={fact.label} sx={{ display: 'flex', gap: 1.5 }}>
                <Box component="dt" sx={{ color: 'primary.main', minWidth: 64, m: 0 }}>
                  {fact.label}
                </Box>
                <Box component="dd" sx={{ m: 0 }}>
                  {fact.value}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
