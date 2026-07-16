// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/TrafficLight');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Traffic Light',
  description:
    'Build a traffic light that cycles green → yellow → red on different durations, forever. Deceptively simple — it tests whether you can model a state machine as data instead of nesting timeouts. Styling kept minimal on purpose.',
  requirements: [
    'Three lights; exactly one active at a time',
    'Green 3s → yellow 1s → red 4s → green (loop forever)',
    'Per-state durations must be easy to change (config, not code)',
    'Timers cleaned up on unmount',
    'Show which light is active and for how long'
  ],
  keyPatterns: [
    'State machine as data: { color: { durationMs, next } }',
    'setTimeout in useEffect keyed on the active state',
    'Effect re-runs when state changes — each state schedules the next',
    'Cleanup: return () => clearTimeout(id)'
  ],
  interviewTip:
    'The weak answer chains setTimeouts or hardcodes an index cycle. The strong answer is one sentence: "I\'ll model it as a config object — each state knows its duration and its successor — and one effect walks the machine." Works unchanged for any number of states.'
};

export default function TrafficLightProblem() {
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
