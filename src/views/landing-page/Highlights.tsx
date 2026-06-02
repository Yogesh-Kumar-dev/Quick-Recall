'use client';

import type { ComponentType } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// assets
import { IconColumns2, IconDeviceLaptop, IconListCheck, IconRefresh } from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'config';

// ==============================|| LANDING - HIGHLIGHTS ||============================== //

type Highlight = {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
};

const highlights: Highlight[] = [
  {
    title: 'See it run, then read it',
    description: 'Every machine-coding problem renders live output beside an editable code viewer — no copy-paste guessing.',
    icon: IconColumns2
  },
  {
    title: 'Three versions per problem',
    description: 'Compare a plain JSX build, a typed TSX build, and a polished MUI build to learn the trade-offs.',
    icon: IconDeviceLaptop
  },
  {
    title: 'Notes that map to questions',
    description: 'Concept cards are written the way interviewers ask — definitions, gotchas, and the follow-up they push on.',
    icon: IconListCheck
  },
  {
    title: 'Refresh in minutes',
    description: 'Quick-recall cheat sheets condense each topic so you can revise the essentials right before the call.',
    icon: IconRefresh
  }
];

function HighlightItem({ item }: { item: Highlight }) {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDark = mode === ThemeMode.DARK;
  const Icon = item.icon;

  return (
    <Stack direction="row" spacing={2.5} alignItems="flex-start">
      <Box
        sx={{
          flexShrink: 0,
          width: 48,
          height: 48,
          borderRadius: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'primary.main',
          bgcolor: isDark ? `${theme.palette.primary.main}22` : 'primary.light'
        }}
      >
        <Icon size={26} stroke={1.75} />
      </Box>
      <Stack spacing={0.75}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {item.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.65 }}>
          {item.description}
        </Typography>
      </Stack>
    </Stack>
  );
}

export default function Highlights() {
  return (
    <Box component="section" sx={{ bgcolor: 'background.paper', borderBlock: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.5rem' } }}>
            Built for the way interviews actually go
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 560 }}>
            Less passive reading, more doing — so concepts stick when the pressure is on.
          </Typography>
        </Stack>

        <Grid container spacing={{ xs: 4, md: 5 }}>
          {highlights.map((item) => (
            <Grid key={item.title} size={{ xs: 12, md: 6 }}>
              <HighlightItem item={item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
