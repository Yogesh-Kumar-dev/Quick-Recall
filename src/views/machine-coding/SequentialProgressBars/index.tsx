// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/SequentialProgressBars');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

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
    <ProblemLayout
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode },
        mui: { component: <MuiVersion />, code: muiCode }
      }}
    />
  );
}
