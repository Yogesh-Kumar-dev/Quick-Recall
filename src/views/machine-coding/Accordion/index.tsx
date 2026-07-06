// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/Accordion');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Accordion Component',
  description:
    'Build an accordion where sections expand/collapse on click. Implement both single-open mode (only one section open at a time) and multi-open mode (multiple sections can be open simultaneously).',
  requirements: [
    'Render a list of items, each with a header and collapsible body',
    'Click a header to expand/collapse its body',
    'Single-open mode: opening one section collapses any previously open section',
    'Multi-open mode: any number of sections can be open at once',
    'Toggle between single-open and multi-open modes at runtime',
    'Smooth open/close animation'
  ],
  keyPatterns: [
    'openIndex: number | null (single-open)',
    'openItems: Set<number> (multi-open)',
    'CSS max-height transition',
    'MUI Collapse component',
    'Toggle pattern with Set'
  ],
  interviewTip:
    'For single-open: store openIndex (number|null). Clicking an open item sets it to null; clicking a closed item sets it to that index. For multi-open: store a Set<number>. Toggle = if Set has index, delete it; else add it. Spread into a new Set to trigger re-render: setOpen(new Set(prev).add/delete).'
};

export default function AccordionApp() {
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
