// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/GroupBy');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟢 Group Array Items by Key',
  description:
    'Implement groupBy(array, keyFn) that buckets array items into an object keyed by keyFn(item), with each value an array of the items sharing that key. A common warm-up that tests comfort with reduce, object accumulation, and the new ES2024 grouping helpers.',
  examples: [
    {
      input: 'groupBy([6.1, 4.2, 6.3], Math.floor)',
      output: "{ '4': [4.2], '6': [6.1, 6.3] }",
      explanation: 'Each number is bucketed by its floored value (object keys are strings).'
    },
    {
      input: 'groupBy(people, p => p.dept)',
      output: '{ eng: [...], design: [...] }',
      explanation: 'Items are grouped by the computed department key.'
    }
  ],
  constraints: [
    'Each bucket must be an array, created lazily on first use.',
    'Support a key function; bonus: also accept a string property name.',
    'Preserve the original order of items within each group.'
  ],
  interviewTip:
    'reduce with `(acc[k] ||= []).push(item)` is the cleanest one-liner. Mention that object keys are coerced to strings, and that ES2024 added native Object.groupBy and Map.groupBy (use Map.groupBy when you need non-string keys).',
  tags: ['reduce', 'array', 'object', 'es2024']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'forEach + Object',
    description: 'Iterate, compute each key, and push into a lazily-created bucket. The clearest beginner-friendly answer.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Very readable', 'Easy to explain step by step', 'Preserves item order'],
    cons: ['A touch more verbose than reduce', 'Key function only (no string shorthand)'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (reduce)',
    description: 'A concise reduce that also accepts a string property name as a key shorthand — lodash _.groupBy style.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Compact', 'Function or property-name key', 'Single pass'],
    cons: ['reduce is less obvious to some readers', 'Logical assignment needs a modern runtime'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in (ES2024)',
    description: 'Object.groupBy and Map.groupBy — the native helpers. Use Map.groupBy when keys must be non-string values.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['No implementation needed', 'Map.groupBy allows object keys', 'Standardised semantics'],
    cons: ['Requires Node 21+ / modern browsers', 'Object.groupBy coerces keys to strings'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function GroupByProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
