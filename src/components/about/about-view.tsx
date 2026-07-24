import { IconArrowRight, IconMail } from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FEATURES } from '@/data/about/about-features';

const CONTACT_URL = 'https://yogesh-kumar-portfolio-v2.vercel.app/#contact';

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

      <div className="grid grid-cols-1 gap-4 [grid-auto-flow:dense] sm:grid-cols-2 md:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.title}
            href={`/about/${f.slug}`}
            className={`group flex flex-col gap-3 rounded-lg border border-border border-l-[3px] bg-card p-5 no-underline transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
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

            <h3 className="font-heading text-lg font-bold text-foreground">{f.title}</h3>
            <p className="grow text-sm text-muted-foreground">{f.blurb}</p>
            <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">built with: {f.tech}</p>
            <span className="flex items-center gap-1 text-xs font-semibold text-primary">
              Deep dive
              <IconArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>

      <hr className="border-border" />

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
