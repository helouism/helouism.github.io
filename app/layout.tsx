import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import Box from '@mui/material/Box';
import ThemeRegistry from '@/components/ThemeRegistry';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { COLOR_SCHEME_ATTRIBUTE } from '@/theme/theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hendrik Louis Mahdi — IT Support & Infrastructure',
  description:
    'L1 IT Support and infrastructure engineer in Tangerang Selatan. Windows, Linux, VMware, Proxmox, MySQL, PostgreSQL, and Laravel application support.',
  authors: [{ name: 'Hendrik Louis Mahdi' }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute={COLOR_SCHEME_ATTRIBUTE} defaultMode="dark" />
        <AppRouterCacheProvider options={{ key: 'mui' }}>
          <ThemeRegistry>
            <Navbar />
            <Box component="div" sx={{ pt: { xs: 8, md: 9 } }}>
              {children}
            </Box>
            <Footer />
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
