// Server Component — readFileSync runs at build time
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/FlattenArray');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const recursiveCode = readFileSync(join(BASE, 'solution-recursive.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Flatten Nested Array',
  description:
    'Write a function that takes a deeply nested array and returns a flat (one-dimensional) array containing all the values. The function should optionally accept a depth parameter — if given, flatten only up to that many levels. This tests recursion, array manipulation, and knowledge of modern JS APIs.',
  examples: [
    {
      input: '[1, [2, [3, [4]], 5]]',
      output: '[1, 2, 3, 4, 5]',
      explanation: 'All levels flattened (default: Infinity depth).'
    },
    {
      input: '[1, [2, [3, [4]]]] with depth = 1',
      output: '[1, 2, [3, [4]]]',
      explanation: 'Only the first level is flattened.'
    },
    {
      input: '[] (empty)',
      output: '[]'
    }
  ],
  constraints: [
    'Elements can be numbers, strings, or nested arrays.',
    'depth parameter (optional) limits how many levels to flatten; Infinity flattens all.',
    'Should not mutate the original array.'
  ],
  interviewTip:
    'Start by mentioning Array.prototype.flat(Infinity) to show you know the built-in. Then implement manually — the recursive approach is clearest and most interview-friendly. If asked about deeply nested arrays (stack overflow risk), present the iterative stack solution.',
  tags: ['array', 'recursion', 'stack', 'es6', 'reduce']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force',
    description:
      'Repeatedly flatten one level at a time using concat spread, looping with Array.some(Array.isArray) until no nested arrays remain. Simple to explain but creates many intermediate arrays.',
    timeComplexity: 'O(n × d)',
    spaceComplexity: 'O(n × d)',
    pros: ['Very simple to explain', 'No recursion needed'],
    cons: ['Creates O(d) intermediate arrays — slow for deep nesting', 'Does not support depth parameter easily'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Recursive',
    description:
      'Iterate over elements; if an element is an array, recurse into it (reducing depth by 1). Clean, readable, and supports an optional depth parameter. The preferred interview answer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n + d)',
    pros: ['O(n) — each element visited once', 'Supports depth limit naturally', 'Easy to read and explain'],
    cons: ['Call stack depth limited by nesting level (risk of stack overflow on extremely deep arrays)'],
    code: recursiveCode,
    filename: 'solution-recursive.js'
  },
  {
    label: 'Optimal (Iterative Stack)',
    description:
      'Uses an explicit stack instead of recursion — no call stack overflow risk regardless of nesting depth. Best for very deeply nested inputs.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['No call stack overflow risk', 'O(n) time and space', 'Handles unlimited nesting depth'],
    cons: ['Slightly harder to read', 'Requires a reverse() at the end (or index-based alternative)'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in',
    description:
      'Array.prototype.flat(Infinity) — always mention this first to demonstrate knowledge of modern JS, then explain you can implement it manually.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['One line', 'Native, well-optimised', 'ES2019+'],
    cons: ['Cannot customise behaviour', 'JSON/toString tricks are limited to specific value types'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function FlattenArrayProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
