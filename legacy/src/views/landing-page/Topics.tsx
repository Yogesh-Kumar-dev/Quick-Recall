'use client';

import type { ComponentType } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// next
import Link from 'next/link';

// assets
import {
  IconBolt,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandRedux,
  IconCode,
  IconTool
} from '@tabler/icons-react';

// project imports
import useConfig from 'hooks/useConfig';
import { ThemeMode } from 'config';
import { jsNotes, tsNotes, jsProblems } from 'data/javascript';
import { reactNotes, reactMcProblems } from 'data/react';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes } from 'data/redux';
import { nextjsNotes, nextjsRenderingNotes } from 'data/nextjs';
import { htmlNotes, cssNotes } from 'data/htmlcss';
import { engineeringNotes } from 'data/engineering';

// ==============================|| LANDING - TOPICS ||============================== //

type Topic = {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ size?: number; stroke?: number }>;
  accent: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
};

const reduxNotesCount = reduxNotes.length + reduxToolkitNotes.length + rtkQueryNotes.length + asyncThunkNotes.length;

const topics: Topic[] = [
  {
    title: 'JavaScript & TypeScript',
    description: `${jsNotes.length} JS notes and ${tsNotes.length} TS notes covering closures, prototypes, async, generics and more.`,
    href: '/js/notes',
    icon: IconBrandJavascript,
    accent: 'warning'
  },
  {
    title: 'React',
    description: `${reactNotes.length} concept notes plus a library of reusable custom hooks with live examples.`,
    href: '/react/notes',
    icon: IconBrandReact,
    accent: 'primary'
  },
  {
    title: 'Machine Coding',
    description: `${jsProblems.length + reactMcProblems.length} problems — ${jsProblems.length} JS and ${reactMcProblems.length} React — each with side-by-side live output and a code viewer.`,
    href: '/react/machine-coding?difficulty=easy',
    icon: IconCode,
    accent: 'secondary'
  },
  {
    title: 'Redux',
    description: `${reduxNotesCount} notes on Redux Toolkit, RTK Query and createAsyncThunk with practical patterns.`,
    href: '/redux/notes',
    icon: IconBrandRedux,
    accent: 'secondary'
  },
  {
    title: 'Next.js',
    description: `${nextjsNotes.length + nextjsRenderingNotes.length} notes on the App Router, server components and rendering strategies.`,
    href: '/nextjs/notes',
    icon: IconBrandNextjs,
    accent: 'error'
  },
  {
    title: 'HTML & CSS',
    description: `${htmlNotes.length} HTML and ${cssNotes.length} CSS notes on semantics, layout, flexbox, grid and the box model.`,
    href: '/html-css/html',
    icon: IconBrandCss3,
    accent: 'primary'
  },
  {
    title: 'Engineering Essentials',
    description: `${engineeringNotes.length} notes on browser internals, networking, security and performance fundamentals.`,
    href: '/engineering/notes',
    icon: IconTool,
    accent: 'warning'
  },
  {
    title: 'Quick Recall',
    description: 'Compact cheat sheets to refresh the essentials minutes before your interview.',
    href: '/js/quick-recall',
    icon: IconBolt,
    accent: 'success'
  }
];

function TopicCard({ topic }: { topic: Topic }) {
  const theme = useTheme();
  const { mode } = useConfig();
  const isDark = mode === ThemeMode.DARK;
  const Icon = topic.icon;
  const accent = theme.palette[topic.accent];

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        boxShadow: 'none',
        transition: theme.transitions.create(['border-color', 'box-shadow', 'transform'], { duration: 200 }),
        '&:hover': {
          borderColor: accent.main,
          boxShadow: `0 12px 32px -12px ${accent.main}66`,
          transform: 'translateY(-4px)'
        }
      }}
    >
      <CardActionArea component={Link} href={topic.href} sx={{ height: '100%', p: 3, alignItems: 'flex-start' }}>
        <Stack spacing={2} alignItems="flex-start" sx={{ height: '100%' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accent.main,
              bgcolor: isDark ? `${accent.main}22` : accent.light
            }}
          >
            <Icon size={28} stroke={1.75} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {topic.title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.65 }}>
            {topic.description}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

export default function Topics() {
  return (
    <Container maxWidth="lg" component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Stack spacing={1.5} alignItems="center" textAlign="center" sx={{ mb: { xs: 5, md: 7 } }}>
        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '1.875rem', md: '2.5rem' } }}>
          Everything you need to prepare
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 400, color: 'text.secondary', maxWidth: 560 }}>
          Structured notes and hands-on problems across the full frontend interview stack.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid key={topic.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <TopicCard topic={topic} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
