// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/Throttle');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement Throttle',
  description:
    'Implement a throttle function that ensures a callback runs at most once per specified time interval, no matter how often it is called. Throttle is the natural counterpart to debounce and a very common interview question — typically used for scroll, resize, and mousemove handlers.',
  examples: [
    {
      input: 'throttle(fn, 1000) — called 10 times within 1 second',
      output: 'fn is called once (leading edge), the rest are ignored',
      explanation: 'The first call fires immediately; subsequent calls inside the window are dropped.'
    },
    {
      input: 'throttle(fn, 200) with trailing edge — rapid calls then silence',
      output: 'fn fires immediately, then once more with the latest args after 200 ms',
      explanation: 'The trailing call guarantees the final state is not lost.'
    }
  ],
  constraints: [
    'fn must run at most once per `limit` milliseconds.',
    'Preserve the original this context and forward all arguments.',
    'Bonus: support a trailing-edge call with the most recent arguments.'
  ],
  interviewTip:
    'Be ready to contrast throttle vs debounce: throttle = at most once per interval (steady cadence); debounce = wait until activity stops. Start with the timestamp version, then add the trailing edge as the follow-up. Use cases: throttle a scroll handler, debounce a search input.',
  tags: ['closure', 'timer', 'higher-order-function', 'performance', 'lodash']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Timestamp (Leading)',
    description:
      'Record the last run time; run fn only when at least `limit` ms have passed. Fires on the leading edge. The simplest correct answer.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Minimal code', 'Fires immediately (leading edge)', 'Easy to explain'],
    cons: ['Drops the final trailing call', 'No cancel support'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Leading + Trailing)',
    description:
      'Adds a trailing-edge call with the most recent arguments so the final state is never lost — mirrors lodash _.throttle. The expected follow-up implementation.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Leading and trailing edges', 'No lost final call', 'Matches lodash behaviour'],
    cons: ['More state to manage', 'Harder to write under pressure'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Flag + setTimeout (ES6)',
    description:
      'Use a boolean cooldown flag cleared by a timer instead of comparing timestamps. The version most often seen in blog posts.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Very readable', 'Quick to write', 'No Date math'],
    cons: ['Lexical this (arrow) — wrong if caller relies on dynamic this', 'No trailing call'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function ThrottleProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
