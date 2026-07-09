import {
  IconArrowRight,
  IconArrowsMaximize,
  IconBell,
  IconCloudDownload,
  IconCode,
  IconDatabase,
  IconFileTypePdf,
  IconLink,
  IconMail,
  IconMicrophone,
  IconPalette,
  IconSearch
} from '@tabler/icons-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

const CONTACT_URL = 'https://yogesh-kumar-portfolio-v2.vercel.app/#contact';

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
      'The entire UI follows MongoDB’s LeafyGreen design system — its colors, typography, and components — for a clean, consistent, accessible interface. Real LeafyGreen components are used where they fit, with shadcn/ui + Tailwind for everything else.',
    tech: '@leafygreen-ui + shadcn/ui + Tailwind',
    accent: '#00684A',
    span: 2
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
    icon: <IconDatabase size={24} />,
    title: 'Offline-First Job Tracker',
    blurb: 'Job applications live in an in-browser database that persists across reloads and syncs live across open tabs.',
    tech: 'Dexie + IndexedDB',
    accent: '#e6529b',
    span: 1
  },
  {
    icon: <IconCode size={24} />,
    title: 'Smart Code Display',
    blurb: 'Lightweight, lazy-loaded syntax highlighting for inline snippets — kept out of the first-load bundle.',
    tech: '@leafygreen-ui/code',
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
  },
  {
    icon: <IconArrowsMaximize size={24} />,
    title: 'Distraction-Free Fullscreen',
    blurb: 'One click expands the whole app to full screen for heads-down study sessions.',
    tech: 'Fullscreen API',
    accent: '#ff9800',
    span: 1
  }
];

interface StackTech {
  label: string;
  icon?: string;
  localSrc?: string;
  emoji?: string; // fallback when no icon exists on thesvg.org (e.g. Zustand)
  width?: number;
}

const CORE_STACK: StackTech[] = [
  { label: 'Next.js 16', icon: 'nextdotjs' },
  { label: 'React 19', icon: 'react' },
  { label: 'Tailwind v4', icon: 'tailwindcss' },
  { label: 'TypeScript', icon: 'typescript' },
  { label: 'Zustand', emoji: '🐻' },
  { label: 'Dexie.js', localSrc: '/assets/images/icons/dexie.png', width: 158 },
  { label: 'nuqs', icon: 'nuqs' },
  { label: 'Vercel', icon: 'vercel' }
];

// ==============================|| ABOUT — UNDER THE HOOD ||============================== //

export default function AboutView() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* The story */}
      <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-10">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Why I built this</p>
          <h1 className="mt-1 font-heading text-3xl font-bold">A single source of truth for my interview prep</h1>
          <div className="mt-3 space-y-3">
            <p className="text-sm leading-7 text-muted-foreground">
              During my job search I kept scattering notes across docs, bookmarks, and old repos — and burning time hunting them down right
              before interviews. I wanted one place I could open and instantly recall what I needed: concepts, patterns, and working code.
            </p>
            <p className="text-sm leading-7 text-muted-foreground">
              So I built QuickRecall to solve my own problem — and used it as an excuse to get hands-on with the things I&apos;d been
              curious about but hadn&apos;t had the chance to ship at work. Every feature here is something I wanted to learn by actually
              building it, not just reading about it.
            </p>
          </div>
        </div>
        <div className="w-full shrink-0 overflow-hidden rounded-xl border border-border shadow-lg md:w-[380px] lg:w-[440px]">
          <Image
            src="/assets/images/claudest-work.jpg"
            alt="Claude hard at work building QuickRecall"
            width={1079}
            height={719}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>

      <hr className="border-border" />

      {/* Header + stack icons */}
      <div>
        <h2 className="font-heading text-2xl font-bold">Under the Hood</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          QuickRecall is more than a notes app — it&apos;s a playground for browser APIs and RSC-first React engineering techniques.
          Here&apos;s what powers it.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-6">
          {CORE_STACK.map((tech) => (
            <div key={tech.label} title={tech.label} className="flex cursor-default transition-transform duration-200 hover:scale-110">
              {tech.emoji ? (
                <span className="flex h-10 w-10 items-center justify-center text-3xl leading-none" role="img" aria-label={tech.label}>
                  {tech.emoji}
                </span>
              ) : (
                <Image
                  src={tech.localSrc ?? `https://thesvg.org/icons/${tech.icon}/default.svg`}
                  alt={tech.label}
                  width={tech.width ?? 40}
                  height={40}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 md:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className={`flex flex-col gap-3 rounded-lg border border-border border-l-[3px] bg-card p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
              f.span === 2 ? 'md:col-span-2' : ''
            }`}
            style={{ borderLeftColor: f.accent }}
          >
            <div
              className="flex h-11 w-11 items-center justify-center rounded-md"
              style={{ color: f.accent, backgroundColor: `${f.accent}1f` }}
            >
              {f.icon}
            </div>

            <h3 className="font-heading text-lg font-bold">{f.title}</h3>
            <p className="grow text-sm text-muted-foreground">{f.blurb}</p>
            <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">built with: {f.tech}</p>
          </div>
        ))}
      </div>

      <hr className="border-border" />

      {/* Get in touch */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Get in touch</p>
        <h2 className="mt-1 font-heading text-2xl font-bold">Want a problem added?</h2>
        <p className="mt-2 mb-4 text-sm leading-7 text-muted-foreground">
          QuickRecall grows with what people want to practise. If there&apos;s a machine-coding problem you&apos;d like to see here — or any
          feedback — send it over. The button opens the contact form on my portfolio.
        </p>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button size="lg" nativeButton={false} render={<a href={CONTACT_URL} target="_blank" rel="noopener noreferrer" />}>
            Suggest a problem
            <IconArrowRight size={18} />
          </Button>
          <a
            href="mailto:kumaryogesh4c8@gmail.com"
            className="flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-primary"
          >
            <IconMail size={16} />
            kumaryogesh4c8@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
