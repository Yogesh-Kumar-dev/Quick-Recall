// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { ApproachData, JsProblemMeta } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/DedupeSortArray');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Remove Duplicates & Sort Array',
  description:
    'Given an array of integers, return the unique values sorted in ascending order WITHOUT using builtin methods — no Set, no sort(), no includes()/indexOf(). A classic warm-up that tests loop control, hash-map usage via plain objects, and whether you can implement a basic sorting algorithm from memory.',
  examples: [
    {
      input: '[1, 4, 2, 6, 1, 8, 4, 56, 8]',
      output: '[1, 2, 4, 6, 8, 56]',
      explanation: '1, 4 and 8 appear twice and collapse to one entry each; the result is ascending.'
    },
    {
      input: '[5, 5, 5]',
      output: '[5]',
      explanation: 'All duplicates reduce to a single element.'
    }
  ],
  constraints: [
    'No builtin dedupe/sort helpers: Set, Map, Array.prototype.sort, indexOf, includes are all off-limits.',
    'Basic loops, comparisons, indexing and building output arrays are allowed.',
    'Do not mutate the input array.',
    'Bonus: also report which elements were duplicated.'
  ],
  interviewTip:
    'Dedupe with a seenMap object for O(1) lookups instead of re-scanning. For the sort, take advantage of how JS iterates object keys: keys that look like integers are visited in ascending numeric order, so inserting each number as its own key and reading Object.values back gives a sorted array with no sorting algorithm at all. Say out loud why it works (array-index keys are ordered first, numerically, by the spec) and its limits: keys coerce through strings and non-integer values fall out of the guarantee. Production code would just use Set + sort().',
  tags: ['hash-map', 'array', 'sorting', 'no-builtins', 'loops']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force',
    description:
      'Dedupe by manually scanning everything collected so far (nested loop), then bubble sort with adjacent swaps. Zero reliance on any helper method.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(m)',
    pros: ['No data structures beyond a plain array', 'Easiest to reason about', 'Bubble sort early-exits on sorted input'],
    cons: ['Quadratic dedupe scan', 'Bubble sort is the slowest hand-written sort'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (hash map + object-key ordering)',
    description:
      'One pass with a seenMap object collapses duplicates in O(n) and collects them into a separate array. For sorting we exploit object key ordering: integer-like keys iterate in ascending numeric order, so inserting each unique number as its own key and reading Object.values(sortMap) returns the sorted array — no sorting algorithm needed.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Single-pass dedupe', 'Linear overall — no O(n²) hand-written sort', 'Also reports duplicates and keeps the seen map'],
    cons: [
      'Only valid because integer-like object keys are spec-ordered numerically',
      'Breaks for non-integer values (1.5 lands in insertion order) since keys coerce through strings',
      'Object.values is itself a builtin'
    ],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Built-in reference',
    description: 'What you would actually ship: Set dedupes, sort() with a numeric comparator orders. Mention it after solving manually.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pros: ['One line', 'Linear dedupe, n log n sort'],
    cons: ['Not allowed under the no-builtins constraint', 'A bare sort() without the comparator sorts as strings ([10] before [2])'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function DedupeSortArrayProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
