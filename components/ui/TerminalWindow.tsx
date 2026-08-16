import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

type Props = { user: string; command: string; children: ReactNode };

export default function TerminalWindow({ user, command, children }: Props) {
  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        overflow: 'hidden',
        maxWidth: 780,
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 2,
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
          <Box
            key={c}
            sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c, opacity: 0.85 }}
          />
        ))}
      </Box>

      <Box sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 } }}>
        <Typography
          component="p"
          sx={{
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '0.875rem',
            color: 'text.secondary',
            mb: 2,
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>
            {user}
          </Box>
          :~$ {command}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
