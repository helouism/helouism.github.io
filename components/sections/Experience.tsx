import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import { experience } from '@/content/experience';

export default function Experience() {
  return (
    <Box component="section" id="experience" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={4} title="Experience" comment="// where the tickets come from" />

        <Box component="ol" sx={{ display: 'grid', gap: 3, listStyle: 'none', m: 0, p: 0 }}>
          {experience.map((job) => (
            <Box
              component="li"
              key={job.id}
              data-current={job.current ? 'true' : undefined}
              sx={{
                listStyle: 'none',
                borderLeft: '2px solid',
                borderColor: job.current ? 'primary.main' : 'divider',
                pl: { xs: 2.5, md: 4 },
                py: 1,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  gap: 1.5,
                  mb: 0.5,
                }}
              >
                <Typography variant="h3" sx={{ fontSize: '1.15rem' }}>
                  {job.role}
                </Typography>
                {job.current && (
                  <Chip
                    label="current"
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ height: 22 }}
                  />
                )}
              </Box>

              <Typography sx={{ color: 'primary.main', fontSize: '0.95rem', mb: 0.5 }}>
                {job.company}
                {job.contract ? ` · ${job.contract}` : ''}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.78rem',
                  color: 'text.secondary',
                  mb: 2,
                }}
              >
                {job.period} · {job.location}
              </Typography>

              {job.summary && (
                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.925rem',
                    maxWidth: '68ch',
                    mb: 2,
                  }}
                >
                  {job.summary}
                </Typography>
              )}

              <Box
                component="ul"
                sx={{ m: 0, pl: 2.5, display: 'grid', gap: 1, listStyleType: 'disc' }}
              >
                {job.bullets.map((bullet) => (
                  <Typography
                    component="li"
                    key={bullet}
                    sx={{ color: 'text.secondary', fontSize: '0.925rem' }}
                  >
                    {bullet}
                  </Typography>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
