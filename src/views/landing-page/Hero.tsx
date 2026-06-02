'use client';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// assets
import { IconArrowRight, IconBolt } from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'config';

// ==============================|| LANDING - HERO ||============================== //

export default function Hero() {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDark = mode === ThemeMode.DARK;

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 14, md: 20 },
        pb: { xs: 10, md: 14 }
      }}
    >
      {/* ambient gradient glow */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isDark
            ? `radial-gradient(60% 50% at 50% 0%, ${theme.palette.primary.dark}33 0%, transparent 70%), radial-gradient(40% 40% at 85% 30%, ${theme.palette.secondary.dark}2e 0%, transparent 70%)`
            : `radial-gradient(60% 50% at 50% 0%, ${theme.palette.primary.light}99 0%, transparent 70%), radial-gradient(40% 40% at 85% 30%, ${theme.palette.secondary.light}80 0%, transparent 70%)`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          <Chip
            icon={<IconBolt size={16} />}
            label="Interview prep, distilled"
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 500, '& .MuiChip-icon': { ml: 1 } }}
          />

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.25rem' },
              lineHeight: 1.1,
              maxWidth: 880,
              letterSpacing: '-0.02em'
            }}
          >
            Crack frontend interviews with{' '}
            <Box
              component="span"
              sx={{
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              QuickRecall
            </Box>
          </Typography>

          <Typography variant="h4" sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 620, lineHeight: 1.6 }}>
            Notes, machine-coding problems with live output, and quick-recall cheat sheets for JavaScript, TypeScript, React, Redux &
            Next.js — all in one place.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
            <Button
              component={Link}
              href="/dashboard"
              variant="contained"
              size="large"
              endIcon={<IconArrowRight size={18} />}
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Start practicing
            </Button>
            <Button
              component={Link}
              href="/react/machine-coding?difficulty=easy"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: '1rem' }}
            >
              Browse problems
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
