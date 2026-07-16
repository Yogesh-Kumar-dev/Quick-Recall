// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/LruCache');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'LRU Cache',
  description:
    'Design a fixed-capacity cache with get(key) and put(key, value) where inserting past capacity evicts the LEAST recently used entry. A top-5 design question — in JavaScript it has an elegant answer most candidates miss.',
  examples: [
    {
      input: "cache(2); put('a',1); put('b',2); get('a'); put('c',3)",
      output: "get('b') → -1, get('a') → 1",
      explanation: "Reading 'a' made it recent, so adding 'c' at capacity evicted 'b' instead."
    }
  ],
  constraints: [
    'get returns -1 for missing keys.',
    'Both get and put count as "using" a key.',
    'put on an existing key updates the value and marks it recent.',
    'Target O(1) for both operations.'
  ],
  interviewTip:
    'In most languages this needs a hashmap + doubly-linked list. In JavaScript, say the magic sentence: "Map preserves insertion order, so delete + set moves a key to the end, and the first key is always the LRU victim." That one-liner turns a hard problem into 15 lines.',
  tags: ['class', 'cache', 'map', 'design', 'leetcode-146']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Array order',
    description: 'Object for values + array tracking recency order. Correct, but every touch is an O(n) indexOf/splice.',
    timeComplexity: 'O(n) per op',
    spaceComplexity: 'O(capacity)',
    pros: ['Easy to reason about', 'Good stepping stone to explain the recency invariant'],
    cons: ['O(n) touch defeats the point of a cache', 'indexOf + splice is fiddly'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Map order)',
    description: 'A single Map: re-insertion moves a key to the end, the first key is the eviction victim. O(1) everything.',
    timeComplexity: 'O(1) per op',
    spaceComplexity: 'O(capacity)',
    pros: ['O(1) get and put', '~15 lines total', 'No linked-list bookkeeping'],
    cons: ['Relies on knowing Map preserves insertion order'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function LruCacheProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
