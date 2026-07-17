// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/PromiseAllSettled');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement Promise.allSettled',
  description:
    'Implement promiseAllSettled(promises) that waits for every promise to finish and never rejects — each result is reported as { status: "fulfilled", value } or { status: "rejected", reason }, in input order.',
  examples: [
    {
      input: 'promiseAllSettled([resolve(1), reject(err), 3])',
      output: "[{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: err }, { status: 'fulfilled', value: 3 }]",
      explanation: 'Every input gets a report object; a rejection does not sink the batch.'
    }
  ],
  constraints: [
    'The returned promise NEVER rejects.',
    'Results stay in input order regardless of settle order.',
    'Plain values count as fulfilled (wrap with Promise.resolve).'
  ],
  interviewTip:
    'Two selling points: the counter version proves you can write Promise.all-style plumbing; the wrapper version ("catch each rejection into a report object, then Promise.all can\'t fail") proves you can think in composition. Offer the wrapper as your production answer.',
  tags: ['promise', 'async', 'polyfill', 'error-handling']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Counter',
    description: 'The Promise.all skeleton — indexed results + settled counter — with rejections recorded instead of propagated.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Shows the underlying mechanics', 'No dependency on Promise.all', 'Easy to extend'],
    cons: ['More code to write under time pressure', 'Two nearly-identical handlers'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Wrap + Promise.all',
    description: 'Map every promise into one that catches its own rejection and returns a report object — then Promise.all can never fail.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['4 lines of real code', 'Impossible to get the counting wrong', 'The answer interviewers hope for'],
    cons: ['Requires spotting the composition trick'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function PromiseAllSettledProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
