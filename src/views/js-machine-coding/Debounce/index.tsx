// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import JsProblemLayout from 'ui-component/js-problem/JsProblemLayout';
import type { JsProblemMeta, ApproachData } from 'types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/Debounce');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟡 Implement Debounce',
  description:
    'Implement a debounce function that delays the execution of a callback until after a specified wait time has elapsed since the last time it was invoked. This is one of the most commonly asked JS interview questions — interviewers often follow up by asking for a leading-edge variant or cancel/flush methods.',
  examples: [
    {
      input: 'debounce(fn, 300) — called 5 times rapidly',
      output: 'fn is called exactly once, 300 ms after the last call',
      explanation: 'Each call resets the timer; only the final call completes the wait.'
    },
    {
      input: 'debounce(fn, 300, { leading: true }) — called 3 times in 200 ms',
      output: 'fn is called immediately on the first call; subsequent calls within 300 ms are ignored',
      explanation: 'Leading-edge fires on the first call, then locks for the delay period.'
    }
  ],
  constraints: [
    'The returned function must preserve the original this context.',
    'Must accept any number of arguments and forward them to fn.',
    'The timer resets on every new call within the delay window.'
  ],
  interviewTip:
    'Start with the simple version (clearTimeout + setTimeout). Then offer the production version with cancel() and flush(). Distinguish debounce (delay until quiet) from throttle (at most once per interval). Common use cases: search input (debounce), scroll handler (throttle).',
  tags: ['closure', 'timer', 'higher-order-function', 'performance', 'lodash']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force',
    description:
      'The most direct implementation: store a timer ID, cancel it on each call, reschedule. No extra features — just the core mechanic. This is what most interviews expect first.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Simple to understand and explain', 'Covers the core requirement', 'Easy to memorise'],
    cons: ['No cancel / flush helpers', 'No leading-edge support'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Production)',
    description:
      'Production-grade with leading edge, cancel(), and flush() — mirrors lodash _.debounce. The interviewer will ask for this after you nail the basics.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Leading edge option (fire on first call)', 'cancel() and flush() for full control', 'Matches lodash signature'],
    cons: ['More code to write under pressure', 'Slightly harder to reason about'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'One-liner (ES6)',
    description:
      'Concise arrow-function version — the style you\'ll see in most blog posts. Perfectly acceptable for interviews where brevity is valued. Lacks leading edge and cancel, but is idiomatic and readable.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Very concise — easy to write quickly', 'Readable at a glance', 'Good starting point'],
    cons: ['Lexical this (arrow) — incorrect if caller relies on dynamic this', 'No cancel/flush'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function DebounceProblem() {
  return <JsProblemLayout problem={PROBLEM} approaches={APPROACHES} />;
}
