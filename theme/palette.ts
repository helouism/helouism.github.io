export type Scheme = {
  bg: string;
  paper: string;
  text: string;
  textSecondary: string;
  accent: string;
  accentContrast: string;
  divider: string;
};

export const palette: { dark: Scheme; light: Scheme } = {
  dark: {
    bg: '#0A0C0A',
    paper: '#0E110E',
    text: '#E6E8E6',
    textSecondary: '#9AA09A',
    accent: '#00E676',
    accentContrast: '#04160C',
    divider: 'rgba(230,232,230,0.10)',
  },
  light: {
    bg: '#FAFAF8',
    paper: '#FFFFFF',
    text: '#16181A',
    textSecondary: '#5A6169',
    accent: '#007A3D',
    accentContrast: '#FFFFFF',
    divider: 'rgba(22,24,26,0.10)',
  },
};
