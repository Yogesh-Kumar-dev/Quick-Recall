// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/CustomBind');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🔴 Implement Function.prototype.bind',
  description:
    'Write a polyfill myBind that returns a new function with `this` permanently bound to a given context and support for partial application. This is a deep test of `this`, closures, and the prototype chain — the new-operator edge case is the classic follow-up.',
  examples: [
    {
      input: 'greet.myBind(person, "Hello")("!") where greet uses this.name',
      output: '"Hello, Ada!"',
      explanation: '`this` is fixed to person; "Hello" is a preset arg, "!" is supplied later.'
    },
    {
      input: 'new (Point.myBind(null, 10))(20)',
      output: 'Point { x: 10, y: 20 }, instanceof Point === true',
      explanation: 'When called with `new`, the bound context is ignored and the prototype chain is preserved.'
    }
  ],
  constraints: [
    'Return a new function; do not invoke the original immediately.',
    'Support partial application of leading arguments.',
    'Bonus: when used with `new`, ignore the bound `this` and preserve the prototype chain.'
  ],
  interviewTip:
    'Capture the original function as `const fn = this`, then return a closure that does fn.apply(context, presetArgs.concat(laterArgs)). The senior follow-up is the `new` case — detect `this instanceof bound` and reset the prototype with Object.create(fn.prototype). Know call/apply/bind cold.',
  tags: ['prototype', 'this', 'closure', 'polyfill']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Core Polyfill',
    description: 'Capture the function, return a closure that applies it with the bound context and merged args. The standard answer.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Fixes `this` correctly', 'Supports partial application', 'Short and clear'],
    cons: ['Breaks when the bound function is used with `new`', 'Does not preserve the prototype chain'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (new-safe)',
    description:
      'Detects construction via `this instanceof bound`, ignores the bound context in that case, and rebuilds the prototype chain. The spec-accurate version.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Correct `new` behaviour', 'Preserves instanceof / prototype', 'Matches the real bind'],
    cons: ['More moving parts', 'Edge case is easy to forget under pressure'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in (call/apply/bind)',
    description: 'The native trio and exactly how call, apply, and bind differ — the guaranteed companion question.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Native and correct', 'Clarifies the three context-setters', 'Common interview discussion'],
    cons: ['Not a from-scratch implementation', 'call vs apply arg form is easy to swap'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function CustomBindProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
