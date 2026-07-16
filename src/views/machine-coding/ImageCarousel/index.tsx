// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/ImageCarousel');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Image Carousel',
  description:
    'Build a carousel with prev/next controls, dot indicators, auto-play, and pause-on-hover. A perennial favorite that combines index arithmetic with the interval lifecycle. Styling kept minimal on purpose (colored panels stand in for images).',
  requirements: [
    'Show one slide at a time with Prev / Next buttons',
    'Both directions wrap around (last → first, first → last)',
    'Dot indicators show position and jump on click',
    'Auto-advance every 2 seconds',
    'Pause auto-play while the mouse is over the carousel'
  ],
  keyPatterns: [
    'Wrap-around: (i + 1) % n and (i - 1 + n) % n',
    'setInterval in useEffect gated on a `paused` flag',
    'Functional update inside the interval (avoids stale index)',
    'onMouseEnter / onMouseLeave toggling pause'
  ],
  interviewTip:
    'Two things score here: the backward wrap `(i - 1 + n) % n` — plain `(i - 1) % n` goes negative in JS, say so — and using a functional update inside the interval so the closure never captures a stale index.'
};

export default function ImageCarouselProblem() {
  return (
    <ProblemShell
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode }
      }}
    />
  );
}
