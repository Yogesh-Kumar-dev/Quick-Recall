// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/Memoize');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟡 Memoize a Function',
  description:
    'Implement memoize(fn) that caches results by arguments, so repeated calls with the same inputs return the cached value instead of recomputing. This is a closures + caching classic — interviewers often follow up with custom key resolvers and cache invalidation.',
  examples: [
    {
      input: 'const f = memoize(square); f(4); f(4);',
      output: '16, 16 — but square runs only once',
      explanation: 'The second call with the same argument returns the cached result.'
    },
    {
      input: 'memoize(fib) for fib(40)',
      output: '102334155, computed quickly',
      explanation: 'Memoising the recursive calls turns exponential work into linear.'
    }
  ],
  constraints: [
    'Repeated calls with equal arguments must not recompute.',
    'Preserve the original this context and forward all arguments.',
    'Bonus: allow a custom key resolver and a way to clear the cache.'
  ],
  interviewTip:
    'Use a Map for the cache. The naive JSON.stringify key is fine to mention but call out its limits (functions/undefined dropped, key-order sensitivity, cost for large args). Offer a custom resolver as the production answer, and mention WeakMap when keys are objects you want garbage-collected.',
  tags: ['closure', 'cache', 'higher-order-function', 'performance', 'Map']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'JSON Key Cache',
    description: 'Serialise the arguments with JSON.stringify to form a cache key, store results in a Map. The quick standard answer.',
    timeComplexity: 'O(1) lookup',
    spaceComplexity: 'O(n) cache',
    pros: ['Handles multiple arguments', 'Simple to write', 'Map avoids prototype pitfalls'],
    cons: ['JSON.stringify is lossy and slow', 'Key-order sensitive', 'Cannot key on functions'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Resolver + clear)',
    description:
      'Accepts a custom key resolver and exposes cache/clear helpers — mirrors lodash _.memoize. The production-grade follow-up.',
    timeComplexity: 'O(1) lookup',
    spaceComplexity: 'O(n) cache',
    pros: ['Custom key strategy', 'Cache is inspectable and clearable', 'Avoids JSON cost'],
    cons: ['Caller must pick a good resolver', 'Default key strategy is heuristic'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Unary (ES6)',
    description: 'A minimal memoizer for pure single-argument functions, using hasOwnProperty for safe cache hits.',
    timeComplexity: 'O(1) lookup',
    spaceComplexity: 'O(n) cache',
    pros: ['Very concise', 'Readable', 'Good for unary pure functions'],
    cons: ['Single argument only', 'Object keys are coerced to strings'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function MemoizeProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
