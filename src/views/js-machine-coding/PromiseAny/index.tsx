// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/PromiseAny');

const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement Promise.any',
  description:
    'Implement promiseAny(promises) that resolves with the first FULFILLED promise, and rejects with an AggregateError only when every input rejects. Tests whether you can invert the counting logic of Promise.all.',
  examples: [
    {
      input: 'promiseAny([rejected, slowResolved])',
      output: 'resolves with the slow value',
      explanation: 'Rejections are tolerated as long as at least one promise fulfills.'
    },
    {
      input: 'promiseAny([reject(a), reject(b)])',
      output: 'rejects with AggregateError { errors: [a, b] }',
      explanation: 'Only when ALL inputs reject does the result reject, collecting every error in order.'
    }
  ],
  constraints: [
    'First fulfillment wins; rejections are collected, not fatal.',
    'Reject with an AggregateError holding all errors in input order.',
    'An empty input array rejects immediately.'
  ],
  interviewTip:
    '"any is all with the paths swapped" — all counts successes and shares one reject; any counts failures and shares one resolve. State that symmetry first, then the counter + errors array writes itself. Don\'t forget AggregateError — naming it is what separates a prepared candidate.',
  tags: ['promise', 'async', 'polyfill', 'aggregate-error']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Optimal',
    description:
      'Share one resolve across all inputs; count rejections into an ordered errors array and reject with AggregateError when the count hits the total.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Matches native semantics including AggregateError', 'Errors kept in input order', 'Handles the empty-array edge case'],
    cons: ['Index bookkeeping is easy to get wrong under pressure — practice it'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function PromiseAnyProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
