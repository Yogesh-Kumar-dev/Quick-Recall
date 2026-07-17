// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/Once');

const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement once()',
  description:
    'Implement once(fn) — the returned function invokes fn on the first call only; subsequent calls return the cached first result. The purest closure warm-up, and a cousin of memoize with a single cache slot.',
  examples: [
    {
      input: 'const init = once(setup); init(); init(); init()',
      output: 'setup runs exactly once; all three calls return the same value',
      explanation: 'The closure remembers both that it ran and what it returned.'
    }
  ],
  constraints: [
    'Return the first result on every later call (even if it is undefined).',
    'Forward arguments and preserve `this` on the first call.',
    'Use a boolean flag, not `result === undefined`, to detect the first call.'
  ],
  interviewTip:
    'Two captured variables — `called` and `result` — and a guard. Mention the trap unprompted: "I use a flag rather than checking result for undefined, because fn might genuinely return undefined." That single sentence is the point of the question.',
  tags: ['closure', 'higher-order-function', 'lodash']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Optimal',
    description: 'Closure over a called-flag and the cached result; apply(this, args) keeps it method-safe.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['8 lines', 'Handles fn returning undefined', 'this-safe'],
    cons: ['Holds a reference to the result forever (fine at this scale)'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function OnceProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
