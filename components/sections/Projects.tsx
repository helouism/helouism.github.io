import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/content/projects';

export default function Projects() {
  return (
    <Box component="section" id="projects" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <SectionHeading index={3} title="Projects" comment="// built end to end, not cloned from a tutorial" />

        <Box
          component="ul"
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            listStyle: 'none',
            m: 0,
            p: 0,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
