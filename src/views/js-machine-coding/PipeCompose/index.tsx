// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/PipeCompose');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement pipe / compose',
  description:
    'Implement pipe(...fns) that chains functions left-to-right — pipe(f, g)(x) === g(f(x)) — and compose, its right-to-left mirror. A quick functional-programming check that also appears inside Redux middleware.',
  examples: [
    {
      input: 'pipe(double, addTen, square)(3)',
      output: '256',
      explanation: '3 → double → 6 → addTen → 16 → square → 256; each output feeds the next input.'
    },
    {
      input: 'compose(double, addTen, square)(3)',
      output: '38',
      explanation: 'compose runs right-to-left: square first (9), then addTen (19), then double (38).'
    }
  ],
  constraints: [
    'Accept any number of functions.',
    'Each function takes exactly one argument (the previous result).',
    'pipe with zero functions returns the input unchanged.'
  ],
  interviewTip:
    '"The chain is a reduce: start with the input, fold each fn over the accumulator." pipe = reduce, compose = reduceRight — one sentence, two one-liners. Bonus: mention Redux\'s applyMiddleware uses compose exactly like this.',
  tags: ['functional-programming', 'reduce', 'higher-order-function', 'redux']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Loop',
    description: 'Explicit accumulator loop — forward for pipe, reverse index for compose. Easiest to narrate.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pros: ['Trivial to step through out loud', 'No reduce gymnastics'],
    cons: ['More lines', 'Reverse loop for compose is easy to off-by-one'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'reduce one-liner',
    description: 'fns.reduce((acc, fn) => fn(acc), input) — and reduceRight for compose.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    pros: ['One line each', 'Zero-functions case falls out for free (reduce with initial value)'],
    cons: ['Double-arrow syntax can trip you up live — practice writing it'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function PipeComposeProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
