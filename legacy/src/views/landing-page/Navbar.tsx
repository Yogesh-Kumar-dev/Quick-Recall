'use client';

// material-ui
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// next
import Link from 'next/link';

// assets
import { IconBolt } from '@tabler/icons-react';

// ==============================|| LANDING - NAVBAR ||============================== //

export default function Navbar() {
  const theme = useTheme();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.default, 0.7),
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 72 } }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            component={Link}
            href="/"
            sx={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'common.white',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }}
            >
              <IconBolt size={20} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.01em' }}>
              QuickRecall
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Button component={Link} href="/dashboard" variant="contained" sx={{ px: 3 }}>
            Open app
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
