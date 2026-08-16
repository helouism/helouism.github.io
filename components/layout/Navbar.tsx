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
        bgcolor: 'rgba(0,0,0,0)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'color-mix(in srgb, var(--mui-palette-background-default) 80%, transparent)',
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
            href="#home"
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

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                underline="none"
                sx={{
                  px: 1.5,
                  py: 1,
                  fontSize: '0.9rem',
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {item.label}
              </Link>
            ))}
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
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setOpen(false)}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.id} component="a" href={`#${item.id}`}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
