import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionHeading from '@/components/ui/SectionHeading';
import TechChip from '@/components/ui/TechChip';
import { skillGroups } from '@/content/skills';

export default function Skills() {
  return (
    <Box component="section" id="skills" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading
          index={2}
          title="Skills"
          comment="// everything here is on the job, not on a course certificate"
        />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {skillGroups.map((group) => (
            <Box key={group.name}>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '0.875rem',
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                {group.name}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {group.items.map((item) => (
                  <TechChip key={item} label={item} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
