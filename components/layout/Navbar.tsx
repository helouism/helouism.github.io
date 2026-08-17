'use client';

import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import { navItems } from '@/content/nav';
import { profile } from '@/content/profile';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <AppBar
      component="header"
      position="fixed"
      elevation={0}
      sx={{
        // Opaque first, translucent only where `color-mix` actually resolves.
        // Without the @supports guard a browser that cannot parse the mix falls
        // all the way back to the AppBar's default primary colour — accent green
        // behind `text.primary`, roughly 1.4:1 and unreadable.
        backgroundColor: 'background.default',
        '@supports (background-color: color-mix(in srgb, red 50%, transparent))': {
          backgroundColor:
            'color-mix(in srgb, var(--mui-palette-background-default) 80%, transparent)',
        },
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      {/* The header content rides the same `Container maxWidth="lg"` every section
          uses, so the brand and nav links line up with the page beneath at every
          width — and keep lining up if the theme's breakpoints ever move. The
          Toolbar drops its own gutters so the Container is the only source of
          horizontal padding. */}
      <Toolbar disableGutters>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link
            href="/#home"
            underline="none"
            sx={{
              fontFamily: 'var(--font-mono), monospace',
              fontWeight: 700,
              color: 'text.primary',
              '&:hover': { color: 'primary.main' },
            }}
          >
            helouism
          </Link>

          <Box sx={{ flexGrow: 1 }} />

          {/* A real `nav` landmark, as the old Bootstrap markup had: without it the
              rotor offers banner/main/contentinfo and no way to reach the section
              links. `role="list"` is explicit because `list-style: none` makes
              WebKit drop the list role. */}
          <Box component="nav" aria-label="Main" sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              component="ul"
              role="list"
              sx={{ display: 'flex', gap: 1, listStyle: 'none', m: 0, p: 0 }}
            >
              {navItems.map((item) => (
                <Box component="li" key={item.id} sx={{ listStyle: 'none' }}>
                  <Link
                    href={`/#${item.id}`}
                    underline="none"
                    sx={{
                      display: 'block',
                      px: 1.5,
                      py: 1,
                      fontSize: '0.9rem',
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    {item.label}
                  </Link>
                </Box>
              ))}
            </Box>
          </Box>

          <ThemeToggle />

          <Button
            variant="outlined"
            size="small"
            href={profile.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </Button>

          <IconButton
            aria-label="Open navigation menu"
            onClick={() => setOpen(true)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>
        </Container>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box component="nav" aria-label="Main" sx={{ width: 240 }} onClick={() => setOpen(false)}>
          {/* `ListItem` wrappers, not bare `ListItemButton`s: an `<a>` as a direct
              child of the `<ul>` is invalid list markup, and `role="list"` then
              promises listitem children that do not exist. */}
          <List role="list">
            {navItems.map((item) => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton component="a" href={`/#${item.id}`}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
