// Server Component — readFileSync runs at build time
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/DeepClone');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const recursiveCode = readFileSync(join(BASE, 'solution-recursive.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟡 Deep Clone an Object',
  description:
    "Write a function deepClone(obj) that returns a completely independent deep copy of an object — modifying the clone must not affect the original. This tests your understanding of reference types, recursion, and knowledge of JavaScript's special object types (Date, RegExp, Map, Set, circular references).",
  examples: [
    {
      input: '{ a: 1, b: { c: 2 } }',
      output: '{ a: 1, b: { c: 2 } } (different reference)',
      explanation: 'clone.b !== original.b — the nested object is also a new copy.'
    },
    {
      input: '{ date: new Date("2024-01-01") }',
      output: '{ date: Date(2024-01-01) } (new Date instance)',
      explanation: 'Date must be cloned as a new Date — not just copied as reference.'
    },
    {
      input: 'Circular reference: a.self = a',
      output: 'Cloned object with clone.self === clone (circular preserved)',
      explanation: 'Naive recursive clone throws on circular references.'
    }
  ],
  constraints: [
    'Handle primitives, plain objects, and arrays.',
    'Bonus: handle Date, RegExp, Map, Set.',
    'Bonus: handle circular references without infinite recursion.'
  ],
  interviewTip:
    'Start with structuredClone (modern built-in) to show knowledge, then mention JSON round-trip and its limits (drops functions, Date becomes string, no circular). Implement recursively for the "real" answer. The circular reference follow-up is very common — use WeakMap as a "seen" cache.',
  tags: ['recursion', 'object', 'WeakMap', 'reference-types', 'structuredClone']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force (JSON)',
    description:
      'JSON.parse(JSON.stringify(obj)) — the classic one-liner. Works for plain JSON-safe data but drops functions, converts Dates to strings, and throws on circular references.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['One line', 'Simple to remember', 'Good for plain data'],
    cons: ['Drops: functions, undefined, RegExp, Symbol', 'Date becomes string', 'Throws on circular references'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Recursive',
    description:
      'Recursively clone each property. Handles primitives, arrays, Date, RegExp, and plain objects. Does not handle circular references or Map/Set — the most common interview implementation.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n + d)',
    pros: ['Handles Date and RegExp correctly', 'Full control over cloning logic', 'Easy to extend'],
    cons: ['No circular reference handling', 'Call stack limited by object depth'],
    code: recursiveCode,
    filename: 'solution-recursive.js'
  },
  {
    label: 'Optimal (+ Circular Refs)',
    description:
      'Uses a WeakMap as a "seen" registry to detect and short-circuit circular references. Also handles Map and Set. This is the production-grade and follow-up interview answer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Handles circular references safely', 'Handles Map and Set', 'WeakMap prevents memory leaks'],
    cons: ['More verbose to write under pressure'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in (structuredClone)',
    description:
      'structuredClone() — introduced in Node 17+ and all modern browsers (2022). Handles Date, Map, Set, ArrayBuffer, and circular references natively.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Native, well-optimised', 'Handles circular references', 'Handles most built-in types'],
    cons: [
      'Does not clone functions',
      'Not available in very old environments',
      'Object spread and Object.assign are SHALLOW (common interview trap)'
    ],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function DeepCloneProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
