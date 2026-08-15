'use client';

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

export const COLOR_SCHEME_ATTRIBUTE = 'data-mui-color-scheme';

const theme = createTheme({
  cssVariables: { colorSchemeSelector: COLOR_SCHEME_ATTRIBUTE },
  colorSchemes: {
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: palette.dark.accent, contrastText: '#04160C' },
        background: {
          default: palette.dark.bg,
          paper: palette.dark.paper,
        },
        text: {
          primary: palette.dark.text,
          secondary: palette.dark.textSecondary,
        },
        divider: palette.dark.divider,
      },
    },
    light: {
      palette: {
        mode: 'light',
        primary: { main: palette.light.accent, contrastText: '#FFFFFF' },
        background: {
          default: palette.light.bg,
          paper: palette.light.paper,
        },
        text: {
          primary: palette.light.text,
          secondary: palette.light.textSecondary,
        },
        divider: palette.light.divider,
      },
    },
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: 'var(--font-inter), system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.7 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        '@media (prefers-reduced-motion: reduce)': {
          html: { scrollBehavior: 'auto' },
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
        body: { WebkitFontSmoothing: 'antialiased' },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 4, paddingInline: 20, paddingBlock: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-mono), ui-monospace, monospace',
          fontSize: '0.75rem',
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme: t }) => ({
          border: `1px solid ${t.palette.divider}`,
          backgroundImage: 'none',
          transition: 'border-color 160ms ease, transform 160ms ease',
          '&:hover': {
            borderColor: t.palette.primary.main,
            transform: 'translateY(-2px)',
          },
        }),
      },
    },
  },
});

export default theme;
