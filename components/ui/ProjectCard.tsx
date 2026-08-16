import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import TechChip from '@/components/ui/TechChip';
import type { Project } from '@/content/types';

// The card is itself the list item of the Projects grid rather than being wrapped
// in one: the `gridColumn` span has to sit on the grid's direct child, and keeping
// it on the same element makes the `ul` conversion a pure tag-name change with no
// layout shift.
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      component="li"
      data-slug={project.slug}
      data-featured={project.featured ? 'true' : 'false'}
      sx={{
        listStyle: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gridColumn: { md: project.featured ? 'span 2' : 'span 1' },
      }}
    >
      <Box
        component="img"
        src={project.image}
        alt={project.alt}
        loading="lazy"
        sx={{
          width: '100%',
          height: { xs: 200, md: project.featured ? 320 : 200 },
          objectFit: 'cover',
          objectPosition: 'top',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      />

      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Typography variant="h3" sx={{ fontSize: '1.25rem', mb: 1.5 }}>
          {project.title}
        </Typography>

        <Typography sx={{ color: 'text.secondary', fontSize: '0.925rem', mb: 2.5 }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 3 }}>
          {project.stack.map((tech) => (
            <TechChip key={tech} label={tech} />
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, mt: 'auto', flexWrap: 'wrap', alignItems: 'center' }}>
          {project.repo && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<GitHubIcon />}
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Source code for ${project.title}`}
            >
              Source
            </Button>
          )}
          {project.demo && (
            <Button
              size="small"
              variant="contained"
              startIcon={<LaunchIcon />}
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo of ${project.title}`}
            >
              Live Demo
            </Button>
          )}
          {!project.repo && (
            <Typography
              component="span"
              sx={{ color: 'text.secondary', fontSize: '0.8125rem', fontStyle: 'italic' }}
            >
              Source private
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
