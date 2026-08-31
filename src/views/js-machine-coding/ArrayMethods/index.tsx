// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { ApproachData, JsProblemMeta } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/ArrayMethods');

const transformCode = readFileSync(join(BASE, 'solution-transform.js'), 'utf-8');
const searchCode = readFileSync(join(BASE, 'solution-search.js'), 'utf-8');
const aggregateCode = readFileSync(join(BASE, 'solution-aggregate.js'), 'utf-8');
const groupCode = readFileSync(join(BASE, 'solution-group-dedupe.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Array Methods Practice: The Essentials',
  description:
    'A 20-user dataset, 20 drills covering the array methods interviews actually ask about: map, filter, find, some/every, reduce, and Set-based dedupe/grouping. Each tab below is a runnable script grouped by method family — work through them in order and you have the daily-driver half of the array-methods interview covered.',
  examples: [
    {
      input: 'users.filter((user) => user.isActive)',
      output: '[Alice, Charlie, Ethan, Fiona, Hannah, Ian, Kevin, Mike, Nina, Priya, Quinn, Sam]',
      explanation: 'filter keeps every element for which the predicate returns truthy.'
    },
    {
      input: 'users.reduce((acc, user) => acc + user.score, 0)',
      output: '1611',
      explanation: 'reduce folds the array into a single value — here a running score sum.'
    }
  ],
  constraints: [
    'One shared 20-user dataset; every drill reads from it.',
    'Prefer immutable patterns: map/filter return new arrays, spread before mutating objects.',
    'Say the time complexity out loud — all of these are single-pass O(n) unless chained.'
  ],
  interviewTip:
    'Know the four search shapes cold: find returns the first match or undefined, filter returns ALL matches, some/every return booleans — all short-circuit. For reduce, memorise its three shapes: fold to value (seed with 0), fold to winner (keep the better of two), fold to object (mutate-and-return the accumulator). And never forget that reduce without an initial value starts at element 0 and THROWS on an empty array.',
  tags: ['map', 'filter', 'find', 'reduce', 'set', 'es6']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Transform & Filter',
    description:
      'map to reshape each item, filter to select, spread-copy for immutable updates. Exercises: names list, active/age>30/department filters, name+score projection, score bump, missing-department fallback, formatted strings.',
    timeComplexity: 'O(n) per drill',
    spaceComplexity: 'O(n)',
    pros: ['The methods you will use literally every day', 'All immutable', 'Chain-friendly'],
    cons: ['Chaining many passes allocates intermediate arrays'],
    code: transformCode,
    filename: 'solution-transform.js'
  },
  {
    label: 'Search & Test',
    description:
      'find vs filter vs some vs every — picking the right shape for "get one", "get all", "any?", "all?". Exercises: find by id, compound predicates (city + isActive), first M-name active, any name contains "i", every city longer than 4 letters.',
    timeComplexity: 'O(n) worst case, short-circuits on success',
    spaceComplexity: 'O(1)',
    pros: ['Short-circuiting avoids wasted iterations', 'Compound && / || predicates compose cleanly'],
    cons: ['find returns undefined when nothing matches — callers must guard'],
    code: searchCode,
    filename: 'solution-search.js'
  },
  {
    label: 'Aggregate (reduce)',
    description:
      'reduce as a swiss-army knife: total score, highest scorer, shortest/longest name, department head-count. Includes the no-initial-value gotcha demonstrated live.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k) — k = distinct keys when folding to an object',
    pros: ['Folds to ANY shape: number, object, single winner', 'Replaces multiple passes with one'],
    cons: ['Less readable than dedicated methods', 'No initial value → throws on empty arrays'],
    code: aggregateCode,
    filename: 'solution-aggregate.js'
  },
  {
    label: 'Group & Dedupe',
    description:
      'Set-spread dedupe, reduce-to-object grouping by department and city, unique sorted departments. The grouping pattern appears in some form in almost every machine-coding round.',
    timeComplexity: 'O(n) dedupe/group, O(n log n) when sorted',
    spaceComplexity: 'O(n)',
    pros: ['Grouping pattern transfers everywhere', 'Set preserves first-insertion order deterministically'],
    cons: ['Object keys coerce to strings', 'ES2024 Object.groupBy makes the manual version optional'],
    code: groupCode,
    filename: 'solution-group-dedupe.js'
  }
];

export default function ArrayMethodsProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
