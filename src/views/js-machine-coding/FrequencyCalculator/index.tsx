// Server Component — readFileSync runs at build time
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/FrequencyCalculator');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟢 Frequency Calculator',
  description:
    'Given an array of items, count how many times each one appears and return the frequency map along with the most repeated and least repeated item. When several items share the highest (or lowest) count, return the one seen first. This is the classic "count with a hash map" pattern that underpins anagram checks, mode-finding, and many other interview questions.',
  examples: [
    {
      input: "['react', 'js', 'html', 'react', 'js', 'next', 'html', 'react']",
      output: "mostRepeated: 'react' (3), leastRepeated: 'next' (1)",
      explanation: 'Counts → react:3, js:2, html:2, next:1. Highest is react; lowest is next.'
    },
    {
      input: "['a']",
      output: "mostRepeated: 'a', leastRepeated: 'a'",
      explanation: 'With one distinct item it is both the most and least repeated.'
    },
    {
      input: '[] (empty)',
      output: 'mostRepeated: null, leastRepeated: null'
    }
  ],
  constraints: [
    'Items can be strings or numbers.',
    'On a tie for most/least, return the item that appears first in the input.',
    'An empty array returns null for both most and least repeated.'
  ],
  interviewTip:
    'Reach for a Map (or plain object) to count in a single O(n) pass — interviewers want to see you avoid the O(n²) nested-loop count. Prefer a Map over a plain object when keys could be numbers or collide with prototype names (e.g. "constructor"). Clarify the tie-breaking rule before coding — it changes the expected output.',
  tags: ['hash-map', 'frequency', 'array', 'reduce', 'object']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force',
    description:
      'For each item, scan the entire array to count its occurrences, then walk the array again to track the running most/least. Correct but wasteful — it re-counts items it has already processed.',
    timeComplexity: 'O(n²)',
    spaceComplexity: 'O(k)',
    pros: ['No extra concepts — just loops', 'Easy to reason about'],
    cons: ['O(n²) — re-scans the array per element', 'Repeats work for duplicate items'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Map)',
    description:
      'Tally every item in one pass with a Map, then make a single pass over the distinct entries to find the extremes (first-seen wins ties). The preferred answer: O(n) and Map-safe for any key.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    pros: ['O(n) — single counting pass', 'Map handles numeric/colliding keys safely', 'Clear separation: count, then reduce'],
    cons: ['Two passes (counting + extremes), though both are linear'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Functional (reduce)',
    description:
      'Build the frequency map with reduce, then derive most/least with Object.entries + reduce. Compact and side-effect-free; uses a plain object so keys are coerced to strings.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(k)',
    pros: ['No mutation of outer state', 'Concise', 'Idiomatic functional JS'],
    cons: ['Object keys are always strings (numbers get coerced)', 'Two reduces over entries to get both extremes'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function FrequencyCalculatorProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
