'use client';

import { ReactNode } from 'react';
import Image from 'next/image';

// material-ui
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

// icons
import {
  IconMicrophone,
  IconBell,
  IconLink,
  IconScan,
  IconStack2,
  IconList,
  IconArrowsMaximize,
  IconLayersSubtract,
  IconCode,
  IconSearch,
  IconArrowRight,
  IconMail
} from '@tabler/icons-react';

// project imports
import { CONTACT_URL } from 'ui-component/SuggestProblemBanner';

// ─── Feature data ───────────────────────────────────────────────────────────────

interface Feature {
  icon: ReactNode;
  title: string;
  blurb: string;
  tech: string;
  accent: string;
  span: 1 | 2;
}

const FEATURES: Feature[] = [
  {
    icon: <IconMicrophone size={24} />,
    title: 'Speak Out Loud',
    blurb: 'Rehearse interview answers aloud and watch your words transcribe live on screen.',
    tech: 'Web Speech API',
    accent: '#f0db4f',
    span: 1
  },
  {
    icon: <IconBell size={24} />,
    title: 'Stay-Focused Alerts',
    blurb: 'Tab away or alt-tab and escalating desktop nudges pull you back on track.',
    tech: 'Web Notifications + Page Visibility API',
    accent: '#f44336',
    span: 1
  },
  {
    icon: <IconLink size={24} />,
    title: 'Shareable Filters',
    blurb: 'Difficulty, category, and search live in the URL — every filtered view is bookmarkable.',
    tech: 'nuqs',
    accent: '#2196f3',
    span: 1
  },
  {
    icon: <IconStack2 size={24} />,
    title: 'In-App Redux DevTools',
    blurb: 'A dockable Redux inspector embedded right in the app — toggle with Ctrl+H, no extension needed.',
    tech: '@redux-devtools',
    accent: '#764abc',
    span: 2
  },
  {
    icon: <IconScan size={24} />,
    title: 'Re-render X-ray',
    blurb: 'Highlights component re-renders live in the app so wasted renders are easy to spot.',
    tech: 'react-scan',
    accent: '#4caf50',
    span: 1
  },
  {
    icon: <IconList size={24} />,
    title: 'Buttery Long Lists',
    blurb: 'Note lists render only what is on screen, staying smooth across hundreds of items.',
    tech: 'react-virtuoso',
    accent: '#00bcd4',
    span: 1
  },
  {
    icon: <IconLayersSubtract size={24} />,
    title: 'Code-Split Redux',
    blurb: 'Feature state slices load only when their section is first visited, keeping the initial bundle lean.',
    tech: 'custom reducerManager + useInjectReducer',
    accent: '#764abc',
    span: 2
  },
  {
    icon: <IconArrowsMaximize size={24} />,
    title: 'Distraction-Free Fullscreen',
    blurb: 'One click expands the whole app to full screen for heads-down study sessions.',
    tech: 'Fullscreen API',
    accent: '#ff9800',
    span: 1
  },
  {
    icon: <IconCode size={24} />,
    title: 'Smart Code Display',
    blurb: 'Lightweight highlighting for inline snippets and a full editor with folding for the code viewer.',
    tech: 'react-syntax-highlighter + monaco-editor',
    accent: '#9c27b0',
    span: 1
  },
  {
    icon: <IconSearch size={24} />,
    title: 'Fuzzy Search',
    blurb: 'Type into the header search to jump to any problem, custom hook, or page — typo-tolerant, ranked, and keyboard-navigable.',
    tech: 'fuse.js',
    accent: '#10b981',
    span: 1
  }
];

interface StackTech {
  label: string;
  // simple-icons slug served by thesvg.org (e.g. /icons/nextdotjs/default.svg)
  icon: string;
}

const CORE_STACK: StackTech[] = [
  { label: 'Next.js 15', icon: 'nextdotjs' },
  { label: 'React 19', icon: 'react' },
  { label: 'MUI 7', icon: 'mui' },
  { label: 'TypeScript', icon: 'typescript' },
  { label: 'Redux Toolkit', icon: 'redux' },
  { label: 'nuqs', icon: 'nuqs' },
  { label: 'React Router', icon: 'react-router' },
  { label: 'Vercel', icon: 'vercel' }
];

// ==============================|| ABOUT — UNDER THE HOOD ||============================== //

export default function AboutPage() {
  return (
    <Box>
      {/* The story — why this exists */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 5 }}
        sx={{ mb: 4, alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box sx={{ maxWidth: 760 }}>
          <Typography variant="overline" color="primary" fontWeight={600}>
            Why I built this
          </Typography>
          <Typography variant="h3" fontWeight={700} gutterBottom sx={{ mt: 0.5 }}>
            A single source of truth for my interview prep
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              During my job search I kept scattering notes across docs, bookmarks, and old repos — and burning time hunting them down right
              before interviews. I wanted one place I could open and instantly recall what I needed: concepts, patterns, and working code.
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              So I built QuickRecall to solve my own problem — and used it as an excuse to get hands-on with the things I&apos;d been
              curious about but hadn&apos;t had the chance to ship at work. Every feature here is something I wanted to learn by actually
              building it, not just reading about it.
            </Typography>
          </Stack>
        </Box>
        <Box
          sx={{
            flexShrink: 0,
            width: { xs: '100%', md: 380, lg: 440 },
            borderRadius: 3,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: 3,
            lineHeight: 0
          }}
        >
          <Image
            src="/assets/images/claudest-work.jpg"
            alt="Claude hard at work building QuickRecall"
            width={1079}
            height={719}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Under the Hood
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720 }}>
          QuickRecall is more than a notes app — it&apos;s a playground for browser APIs and React/Redux engineering techniques. Here&apos;s
          what powers it.
        </Typography>

        {/* Core stack icons */}
        <Stack direction="row" spacing={3} flexWrap="wrap" useFlexGap sx={{ mt: 2.5 }}>
          {CORE_STACK.map((tech) => (
            <Tooltip key={tech.label} title={tech.label} arrow>
              <Box
                sx={{
                  display: 'flex',
                  cursor: 'default',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.15)' }
                }}
              >
                <Image src={`https://thesvg.org/icons/${tech.icon}/default.svg`} alt={tech.label} width={40} height={40} />
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Bento grid */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridAutoFlow: 'dense',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' }
        }}
      >
        {FEATURES.map((f) => (
          <Box
            key={f.title}
            sx={{
              gridColumn: { md: f.span === 2 ? 'span 2' : 'span 1' },
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              p: 2.5,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderLeft: '3px solid',
              borderLeftColor: f.accent,
              bgcolor: 'background.paper',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              }
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: f.accent,
                bgcolor: alpha(f.accent, 0.12)
              }}
            >
              {f.icon}
            </Box>

            {/* Title + blurb */}
            <Typography variant="h5" fontWeight={700}>
              {f.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              {f.blurb}
            </Typography>

            {/* Built with */}
            <Typography variant="caption" sx={{ mt: 0.5, fontFamily: 'monospace', color: 'text.secondary', letterSpacing: 0.2 }}>
              built with: {f.tech}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Get in touch — invite problem suggestions */}
      <Box sx={{ maxWidth: 760 }}>
        <Typography variant="overline" color="primary" fontWeight={600}>
          Get in touch
        </Typography>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 0.5 }}>
          Want a problem added?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2.5 }}>
          QuickRecall grows with what people want to practise. If there&apos;s a machine-coding problem you&apos;d like to see here — or any
          feedback — send it over. The button opens the contact form on my portfolio.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
          <Button href={CONTACT_URL} target="_blank" rel="noopener noreferrer" variant="contained" endIcon={<IconArrowRight size={18} />}>
            Suggest a problem
          </Button>
          <Stack
            component="a"
            href="mailto:kumaryogesh4c8@gmail.com"
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ color: 'text.secondary', textDecoration: 'none', '&:hover': { color: 'primary.main' } }}
          >
            <IconMail size={16} />
            <Typography variant="body2">kumaryogesh4c8@gmail.com</Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
