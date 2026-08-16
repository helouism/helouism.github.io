import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { index: number; title: string; comment: string };

export default function SectionHeading({ index, title, comment }: Props) {
  return (
    <Box sx={{ mb: { xs: 4, md: 6 } }}>
      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
        <Typography
          component="span"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            color: 'primary.main',
            fontSize: '0.875rem',
          }}
        >
          {String(index).padStart(2, '0')}
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.75rem' } }}>
          {title}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontFamily: 'var(--font-mono), monospace',
          color: 'text.secondary',
          fontSize: '0.875rem',
          mt: 1,
        }}
      >
        {comment}
      </Typography>
    </Box>
  );
}
