// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/Stopwatch');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Stopwatch',
  description:
    'Build a stopwatch with start/pause/reset showing minutes, seconds, and centiseconds. The go-to question for testing whether you actually understand the useEffect interval lifecycle — most candidates leak the interval or drift the clock. Styling kept minimal on purpose.',
  requirements: [
    'Display elapsed time as MM:SS.CC, updating smoothly',
    'Start / Pause toggle; Reset stops and zeroes',
    'Pausing must not lose the elapsed time; resuming continues from it',
    'No timer drift over long runs',
    'Interval must be cleaned up on pause and unmount'
  ],
  keyPatterns: [
    'setInterval inside useEffect gated on `running`',
    'Cleanup function: return () => clearInterval(id)',
    'Elapsed = Date.now() - startRef (timestamp math, not counter += 10)',
    'useRef for the start timestamp (does not drive rendering)'
  ],
  interviewTip:
    'The trap: elapsed += 10 inside the interval drifts, because setInterval is not precise. Store a start timestamp in a ref and compute Date.now() - start each tick. Say this before writing code — the interviewer is waiting for exactly that sentence.'
};

export default function StopwatchProblem() {
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
