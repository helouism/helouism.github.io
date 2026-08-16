import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import { education } from '@/content/education';

export default function Education() {
  return (
    <Box component="section" id="education" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={5} title="Education" comment="// the paper trail" />

        <Box
          component="ul"
          role="list"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {education.map((e) => (
            <Box
              component="li"
              key={e.id}
              sx={{
                listStyle: 'none',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1.5,
                p: 3,
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.05rem', mb: 0.75 }}>
                {e.degree}
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1.5 }}>
                {e.school}
              </Typography>
              {e.description && (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 1.5 }}>
                  {e.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono), monospace',
                    fontSize: '0.78rem',
                    color: 'text.secondary',
                  }}
                >
                  {e.period}
                </Typography>
                {e.note && (
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '0.78rem',
                      color: 'primary.main',
                    }}
                  >
                    {e.note}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
