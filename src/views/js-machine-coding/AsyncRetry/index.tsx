// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/AsyncRetry');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Async Retry with Backoff',
  description:
    'Implement retry(fn, retries, delay) that re-invokes a failing async function until it succeeds or attempts run out. The most practical async question there is — every real codebase has one of these around fetch.',
  examples: [
    {
      input: 'retry(flaky, 5, 100) where flaky fails twice then succeeds',
      output: "resolves 'succeeded on call 3' after two 100ms waits",
      explanation: 'Failures are swallowed and retried; the eventual success resolves the outer promise.'
    },
    {
      input: 'retry(alwaysFails, 2, 100)',
      output: 'rejects with the LAST error after 3 total calls',
      explanation: 'When attempts run out, surface the real error — never a generic "retries exceeded".'
    }
  ],
  constraints: [
    'fn is async (or returns a promise); wait `delay` between attempts.',
    'Reject with the final underlying error once attempts are exhausted.',
    'Follow-up: exponential backoff (2^attempt) with a max cap and random jitter.'
  ],
  interviewTip:
    'A sleep() helper (`new Promise(res => setTimeout(res, ms))`) plus try/catch in a loop is the whole answer — say "sleep helper" out loud and the rest is mechanical. When they ask "what if 1000 clients retry together?", that\'s your cue for backoff + jitter.',
  tags: ['async', 'promise', 'error-handling', 'backoff']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Fixed delay',
    description: 'try/catch with recursion and a constant wait — the version to write first.',
    timeComplexity: 'O(retries)',
    spaceComplexity: 'O(retries) recursion',
    pros: ['6 lines of logic', 'Reads exactly like the problem statement'],
    cons: ['Constant delay hammers a struggling service', 'Recursion depth grows with retries (trivial here)'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Backoff + jitter',
    description: 'Loop-based version with exponential backoff, a delay cap, and jitter — what production clients actually do.',
    timeComplexity: 'O(retries)',
    spaceComplexity: 'O(1)',
    pros: ['Backoff protects the downstream service', 'Jitter prevents thundering-herd retries', 'Options object mirrors real libraries'],
    cons: ['More knobs to explain'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function AsyncRetryProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
