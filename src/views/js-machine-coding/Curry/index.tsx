// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/Curry');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Curry a Function',
  description:
    'Implement curry(fn) that transforms a function taking multiple arguments into a sequence of functions each taking a single argument (or some of them). curriedSum(1)(2)(3) and curriedSum(1, 2)(3) should both return the same result. This is a classic closures + higher-order-function interview question.',
  examples: [
    {
      input: 'curry(sum)(1)(2)(3) where sum = (a, b, c) => a + b + c',
      output: '6',
      explanation: 'Arguments are collected one at a time until the original arity (3) is met, then sum runs.'
    },
    {
      input: 'curry(sum)(1, 2)(3)',
      output: '6',
      explanation: 'Multiple arguments can be passed in a single call; currying still fills the remaining slots.'
    }
  ],
  constraints: [
    'Respect the original function arity via fn.length.',
    'Preserve the original this context when finally invoking fn.',
    'Allow arguments to be supplied across any number of calls.'
  ],
  interviewTip:
    'Start with the fixed-arity version using fn.length and recursion. Mention the placeholder variant (lodash _.curry) for out-of-order args as a follow-up, and the infinite-currying trick (call with () to terminate) when arity is unknown. Be ready to contrast currying with partial application: currying always produces a chain of single-argument functions — f(a)(b)(c) — whereas partial application fixes some arguments up front and returns a function taking the rest, e.g. const add5 = add.bind(null, 5). Both build on closures and enable point-free composition.',
  tags: ['closure', 'higher-order-function', 'recursion', 'functional-programming']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Fixed Arity',
    description:
      'Collect arguments across calls; once the count reaches fn.length, invoke the original function. The standard interview answer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Simple recursive logic', 'Respects original arity', 'Handles both (1)(2)(3) and (1, 2)(3)'],
    cons: ['Requires a fixed, known arity (fn.length)', 'No out-of-order argument support'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Placeholders)',
    description:
      'Production-grade curry supporting a placeholder symbol so arguments can be supplied out of order — mirrors lodash _.curry. The common follow-up after the basic version.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Out-of-order args via placeholder', 'Matches lodash semantics', 'Still arity-aware'],
    cons: ['More code to write under pressure', 'Placeholder bookkeeping is fiddly'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Infinite Currying (ES6)',
    description:
      'When the arity is unknown, accumulate values until called with no arguments. A popular interview trick — curriedSum(1)(2)(3)() returns 6.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Works for any number of arguments', 'Concise arrow-function style', 'Demonstrates closures clearly'],
    cons: ['Needs an explicit terminator call ()', 'Result logic baked into the curry (sum here)'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function CurryProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
