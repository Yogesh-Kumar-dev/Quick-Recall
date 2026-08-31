// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { ApproachData, JsProblemMeta } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/ArrayMethods2');

const sortBasicsCode = readFileSync(join(BASE, 'solution-sort-basics.js'), 'utf-8');
const multiKeyCode = readFileSync(join(BASE, 'solution-multi-key-chained.js'), 'utf-8');
const pitfallsCode = readFileSync(join(BASE, 'solution-sort-pitfalls.js'), 'utf-8');
const drillsCode = readFileSync(join(BASE, 'solution-combined-drills.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Array Methods Practice: Sorting & Composition',
  description:
    'Part 2 of the array-methods drills: everything sorting. Comparators for numbers and strings, ES2023 toSorted vs mutating sort, multi-key comparator chaining, slicing sorted output, and pipelines that combine filter + map + sort + slice. Same 20-user dataset as Part 1 — finish this tab set and sorting questions hold no surprises.',
  examples: [
    {
      input: 'users.toSorted((a, b) => b.score - a.score).slice(0, 5)',
      output: '[Sam 96, Mike 93, George 95→…top 5 by score]',
      explanation: 'Sort descending then take a window — comparator direction flips with subtraction order.'
    },
    {
      input: '(a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)',
      output: 'Sorted by city, ties broken by name',
      explanation: '|| chains comparators: the second only runs when the first returns 0 (falsy).'
    }
  ],
  constraints: [
    'Use toSorted (ES2023) so the source array is never mutated; know the [...arr].sort() fallback.',
    'Numeric fields sort by subtraction; strings need localeCompare.',
    'Multi-key ordering must be stable: primary key first, tie-breakers after.'
  ],
  interviewTip:
    'The trap they are fishing for: sort() mutates the original array while toSorted() returns a copy — demonstrate you know it unprompted (and that O(n) reduce beats sorting just to find one max). Second-order points worth raising: bare sort() compares as STRINGS ([10] lands before [2]), localeCompare handles case/accent ordering that plain comparison gets wrong, and the || chaining trick scales multi-key sorts cleanly.',
  tags: ['toSorted', 'sort', 'localeCompare', 'comparator', 'slice', 'es2023']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Sort Basics',
    description:
      'The two comparator patterns: numeric subtraction for ages/scores (flip operand order for ascending vs descending) and localeCompare for names.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n) — toSorted copies',
    pros: ['Covers 90% of real sorting questions', 'toSorted keeps state updates safe'],
    cons: ['Bare sort() with no comparator sorts as strings — classic silent bug'],
    code: sortBasicsCode,
    filename: 'solution-sort-basics.js'
  },
  {
    label: 'Multi-key & Chained',
    description:
      'Comparator chaining with || for tie-breakers, top-N/last-N windows via slice (including negative indices), and sorting on derived values like name length.',
    timeComplexity: 'O(n log n)',
    spaceComplexity: 'O(n)',
    pros: ['Handles "sort by X then Y" questions directly', 'Composable pipeline style'],
    cons: ['Long || chains get hard to read — extract a compare function beyond ~3 keys'],
    code: multiKeyCode,
    filename: 'solution-multi-key-chained.js'
  },
  {
    label: 'Sort Pitfalls',
    description:
      'Finding the highest scored user two ways: sort() silently REORDERS the source array, reduce answers the same question without touching anything — and in O(n) instead of O(n log n).',
    timeComplexity: 'sort: O(n log n) · reduce: O(n)',
    spaceComplexity: 'reduce: O(1)',
    pros: ['The exact mutation bug React punishes', 'Shows depth: correctness AND complexity'],
    cons: ['None — knowing this is purely upside in an interview'],
    code: pitfallsCode,
    filename: 'solution-sort-pitfalls.js'
  },
  {
    label: 'Combined Drills',
    description:
      'Pipelines mixing several methods: every/some checks, character-class filters via [chars].includes(name[0]), OR-filters across departments/cities, map-then-sort names, inclusive score bands.',
    timeComplexity: 'O(n) per pass, O(n log n) when sorted',
    spaceComplexity: 'O(n)',
    pros: ['Realistic interview phrasing ("get users whose...")', 'Filter-before-map keeps later stages cheap'],
    cons: ['Deep chains allocate intermediates — mention .flatMap or a single loop as alternative'],
    code: drillsCode,
    filename: 'solution-combined-drills.js'
  }
];

export default function ArrayMethods2Problem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
