'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
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
  IconMail,
  IconDatabase,
  IconBrandYoutube,
  IconCloudDownload,
  IconPalette,
  IconFileTypePdf
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
  /** Optional vertical span — a content-heavy card can occupy two rows. */
  rowSpan?: 2;
  /** Optional external link rendered as a "Learn more →" affordance on the card. */
  href?: string;
}

const FEATURES: Feature[] = [
  {
    icon: <IconCloudDownload size={24} />,
    title: 'Installable & Offline-First',
    blurb:
      'Install QuickRecall like a native app, then download sections for offline study — pick what you need or grab everything, with live per-section progress. It even detects what is already saved and refreshes after a new release.',
    tech: 'PWA · Serwist service worker + Cache Storage API',
    accent: '#5a0fc8',
    span: 2
  },
  {
    icon: <IconPalette size={24} />,
    title: 'MongoDB Design System',
    blurb:
      'The entire UI follows MongoDB’s LeafyGreen design system — its colors, typography, and components — for a clean, consistent, accessible interface. Real LeafyGreen components are used where they fit, with MUI themed to match everywhere else.',
    tech: '@leafygreen-ui + MUI (themed to LeafyGreen)',
    accent: '#00684A',
    span: 1,
    rowSpan: 2,
    href: 'https://www.mongodb.design/'
  },
  {
    icon: <IconFileTypePdf size={24} />,
    title: 'Cache-Once PDF Guides',
    blurb:
      'Interview tip-sheet PDFs open in a browser-style tabbed reader right inside the app. Each one streams once from blob storage, then is served from cache forever — available offline and easy on bandwidth.',
    tech: 'EmbedPDF (PDFium/WASM) + Cache Storage API + Vercel Blob',
    accent: '#e94235',
    span: 2
  },
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
    icon: <IconBrandYoutube size={24} />,
    title: 'Embedded Video Player',
    blurb:
      'Topic-specific YouTube playlists play right inside the app — shuffled on each launch, with the frame auto-switching between portrait Shorts and landscape videos.',
    tech: 'react-youtube + YouTube IFrame API + oEmbed',
    accent: '#FF0000',
    span: 1,
    rowSpan: 2
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
    icon: <IconDatabase size={24} />,
    title: 'Offline-First Job Tracker',
    blurb: 'Job applications live in an in-browser database that persists across reloads and syncs live across open tabs.',
    tech: 'Dexie + IndexedDB',
    accent: '#e6529b',
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
  },
  {
    icon: <IconLink size={24} />,
    title: 'Shareable Filters',
    blurb: 'Difficulty, category, and search live in the URL — every filtered view is bookmarkable.',
    tech: 'nuqs',
    accent: '#016bf8',
    span: 1
  }
];

interface StackTech {
  label: string;
  // simple-icons slug served by thesvg.org (e.g. /icons/nextdotjs/default.svg)
  icon: string;
  // Optional locally-hosted asset (for logos simple-icons/thesvg.org doesn't carry,
  // e.g. Dexie). When set, this is used instead of the thesvg.org template.
  localSrc?: string;
  // Render width in px (defaults to a square 40). Wide wordmarks (Dexie) override this.
  width?: number;
}

const CORE_STACK: StackTech[] = [
  { label: 'Next.js 15', icon: 'nextdotjs' },
  { label: 'React 19', icon: 'react' },
  { label: 'MUI 7', icon: 'mui' },
  { label: 'TypeScript', icon: 'typescript' },
  { label: 'Redux Toolkit', icon: 'redux' },
  { label: 'Dexie.js', icon: 'dexie', localSrc: '/assets/images/icons/dexie.png', width: 158 },
  { label: 'PWA (Serwist)', icon: 'pwa' },
  { label: 'nuqs', icon: 'nuqs' },
  { label: 'React Router', icon: 'react-router' },
  { label: 'YouTube', icon: 'youtube' },
  { label: 'Vercel', icon: 'vercel' }
];

// ==============================|| ABOUT — UNDER THE HOOD ||============================== //

export default function AboutPage() {
  // Theme tokens for the bento cards (divider/paper/secondary) — Tailwind can't express MUI theme
  // colors and this project doesn't enable MUI CSS variables, so we read them here for inline style.
  const theme = useTheme();

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
            priority
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
                <Image
                  src={tech.localSrc ?? `https://thesvg.org/icons/${tech.icon}/default.svg`}
                  alt={tech.label}
                  width={tech.width ?? 40}
                  height={40}
                />
              </Box>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      {/* Bento grid */}
      {/* Bento grid — Tailwind for the responsive layout + card structure; inline style only for
          the dynamic per-card accent and MUI theme-token colors (which Tailwind can't express). */}
      <div className="grid grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`flex flex-col gap-3 rounded-lg border border-solid border-l-[3px] p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              f.span === 2 ? 'md:col-span-2' : ''
            } ${f.rowSpan === 2 ? 'md:row-span-2' : ''}`}
            style={{
              borderColor: theme.palette.divider,
              borderLeftColor: f.accent,
              backgroundColor: theme.palette.background.paper
            }}
          >
            {/* Icon */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-md"
              style={{ color: f.accent, backgroundColor: alpha(f.accent, 0.12) }}
            >
              {f.icon}
            </div>

            {/* Title + blurb (kept on MUI typography for the theme's fonts/sizes/colors) */}
            <Typography variant="h5" component="h4" fontWeight={700}>
              {f.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" className="grow">
              {f.blurb}
            </Typography>

            {/* Built with */}
            <Typography variant="caption" className="mt-1 font-mono tracking-wide" color="text.secondary">
              built with: {f.tech}
            </Typography>

            {/* Optional external link */}
            {f.href && (
              <a
                href={f.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 self-start text-[0.8125rem] font-semibold no-underline hover:underline"
                style={{ color: theme.palette.primary.main }}
              >
                Learn more about {f.title}
                <IconArrowRight size={15} />
              </a>
            )}
          </div>
        ))}
      </div>

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
