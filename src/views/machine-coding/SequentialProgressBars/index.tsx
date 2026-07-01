// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/SequentialProgressBars');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Sequential Progress Bars',
  description:
    'Build a React component where clicking "Add Bar" creates a new progress bar that fills from 0 → 100%. Bars must animate sequentially — only one bar runs at a time. Each bar takes ~2 seconds to fill. Rapid clicks should queue bars and run them in order.',
  requirements: [
    'Clicking "Add Bar" creates a new progress bar immediately (visible as queued)',
    'Only one bar animates at a time — the others wait',
    'Each bar takes exactly 2000 ms to fill from 0 → 100%',
    'When a bar completes, the next queued bar starts automatically',
    'Multiple rapid clicks queue up all bars in order',
    'Show status for each bar: Queued / Running / Done',
    'Include a Reset button to clear all bars'
  ],
  keyPatterns: [
    'Two separate useEffects',
    'activeBarId as the trigger',
    'Functional setState (prev =>)',
    'setInterval + cleanup',
    'Sequential queue via status field'
  ],
  interviewTip:
    "The trick is TWO separate useEffects. Effect 1 watches activeBarId: when it's null (no bar running), find the first 'queued' bar and flip it to 'running'. Effect 2 watches activeBarId: when it changes to a real ID, start a setInterval that increments that bar's progress and marks it 'done' at 100%. Using functional setBars(prev => ...) inside the interval avoids stale-closure issues. Both effects have [activeBarId] as their only dependency — bars itself is never a dep."
};

export default function SequentialProgressBarsApp() {
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
