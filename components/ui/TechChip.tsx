import Chip from '@mui/material/Chip';

export default function TechChip({ label }: { label: string }) {
  return (
    <Chip
      label={label}
      size="small"
      variant="outlined"
      sx={{
        borderColor: 'divider',
        color: 'text.secondary',
        transition: 'color 160ms ease, border-color 160ms ease',
        '&:hover': { color: 'primary.main', borderColor: 'primary.main' },
      }}
    />
  );
}
