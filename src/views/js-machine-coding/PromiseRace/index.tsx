// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/PromiseRace');

const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement Promise.race',
  description:
    'Implement promiseRace(promises) that settles as soon as the FIRST input promise settles — resolving or rejecting with that result. The classic follow-up to Promise.all, and the building block for timeout guards.',
  examples: [
    {
      input: 'promiseRace([slow(500ms), fast(100ms)])',
      output: "resolves with 'fast' after ~100ms",
      explanation: 'The first promise to settle wins; the slower result is ignored.'
    },
    {
      input: 'promiseRace([fetch(url), timeout(3000ms)])',
      output: 'rejects with "Timed out" if fetch takes over 3s',
      explanation: 'The most common real-world use: racing a request against a timeout.'
    }
  ],
  constraints: [
    'Settle with the first promise that settles — whether it resolves OR rejects.',
    'Handle plain (non-promise) values via Promise.resolve wrapping.',
    'Later settlements must be silently ignored.'
  ],
  interviewTip:
    'The whole trick is one sentence: "a promise can only settle once, so I forward every input to the same resolve/reject and the first one wins." Say that out loud before writing the loop — it shows you understand promise semantics, not just syntax.',
  tags: ['promise', 'async', 'polyfill', 'timeout']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Optimal',
    description: 'Forward every input to one shared resolve/reject pair; the first settlement wins because a promise settles only once.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pros: ['Tiny — 6 lines of real code', 'Handles plain values', 'Exactly matches the native semantics'],
    cons: ['Losing promises keep running (no cancellation)'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function PromiseRaceProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
