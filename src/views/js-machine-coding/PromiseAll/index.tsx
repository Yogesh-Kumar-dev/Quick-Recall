// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/PromiseAll');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement Promise.all',
  description:
    'Write a polyfill for Promise.all(promises) that resolves with an array of results — in input order — once every promise resolves, and rejects as soon as any one of them rejects (fail-fast). This tests your understanding of promises, closures, and asynchronous control flow.',
  examples: [
    {
      input: 'promiseAll([Promise.resolve(1), 2, Promise.resolve(3)])',
      output: '[1, 2, 3]',
      explanation: 'Non-promise values are treated as already-resolved; order matches the input.'
    },
    {
      input: 'promiseAll([Promise.resolve(1), Promise.reject("boom")])',
      output: 'Rejects with "boom"',
      explanation: 'The first rejection rejects the whole aggregate immediately (fail-fast).'
    }
  ],
  constraints: [
    'Results must be returned in the original input order, not completion order.',
    'Reject as soon as the first input promise rejects.',
    'Handle an empty input by resolving with an empty array.',
    'Treat non-promise values as already resolved.'
  ],
  interviewTip:
    'Track a completed counter and write results by index to preserve order — do not push. Wrap each item in Promise.resolve so plain values work. Be ready to contrast with allSettled (never rejects), race (first to settle), and any (first to fulfil).',
  tags: ['promise', 'async', 'polyfill', 'closure']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Core Polyfill',
    description:
      'Counter + indexed results array inside a new Promise. Resolve when all complete; reject on the first failure. The standard answer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Preserves input order via index', 'Fail-fast on first rejection', 'Handles non-promise values'],
    cons: ['Array-only (no generic iterable)', 'No concurrency limit'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Iterable + async)',
    description:
      'Accepts any iterable and uses async/await for clarity while keeping order and fail-fast semantics. A clean, modern implementation.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Works with any iterable', 'Readable async/await', 'Order preserved'],
    cons: ['Still no concurrency limit', 'async callbacks add minor overhead'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in + Combinators',
    description:
      'The native Promise.all plus its siblings — allSettled, race, any — and exactly how each differs. The expected follow-up discussion.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Native and optimised', 'Shows breadth of the Promise API', 'Covers common follow-ups'],
    cons: ['Not a from-scratch implementation', 'Combinator semantics are easy to mix up'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function PromiseAllProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
