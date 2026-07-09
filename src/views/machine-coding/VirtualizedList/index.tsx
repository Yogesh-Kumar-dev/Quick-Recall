// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/VirtualizedList');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Virtualized List',
  description:
    'Render a list of 100 items — each labelled "div 1", "div 2" … "div 100". The items are revealed in batches as the user scrolls, using an IntersectionObserver sentinel at the bottom of the list rather than a scroll listener.',
  requirements: [
    'Render 100 items, each showing the label "div N" (1-indexed)',
    'Start with a small batch and reveal more as a bottom sentinel scrolls into view',
    'Use an IntersectionObserver attached to a sentinel element (no scroll listener)',
    'Stop revealing once all 100 items are shown'
  ],
  keyPatterns: ['IntersectionObserver', 'sentinel ref', 'batch reveal'],
  interviewTip:
    'Be clear on the tradeoff: this observer "reveal" approach still MOUNTS every revealed node, so the DOM keeps growing — fine for 100 items. True virtualization (react-window / react-virtuoso) keeps a roughly constant number of nodes in the DOM regardless of list size by only rendering the rows in (and just around) the viewport — mention it as the answer for thousands of items.'
};

export default function VirtualizedListApp() {
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
