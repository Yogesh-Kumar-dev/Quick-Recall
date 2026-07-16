// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/DeepEqual');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Deep Equality Check',
  description:
    'Implement deepEqual(a, b) that compares two values structurally — nested objects and arrays included. The sibling of deep-clone, and a direct test of your recursion base cases.',
  examples: [
    {
      input: 'deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })',
      output: 'true',
      explanation: 'Key order must not matter — the classic trap for the JSON.stringify shortcut.'
    },
    {
      input: 'deepEqual({ a: 1 }, { a: 1, b: 2 })',
      output: 'false',
      explanation: 'Extra keys mean the structures differ; compare key counts before recursing.'
    }
  ],
  constraints: [
    'Handle primitives, nested objects, and arrays.',
    'Key order must not affect the result.',
    'NaN should equal NaN (use Object.is, not ===).',
    'Array vs plain object with the same indices must NOT be equal.'
  ],
  interviewTip:
    'Offer JSON.stringify first and name why it fails (key order, undefined, NaN) — then write the real version. The recursive shape to memorize: Object.is → both objects? → same array-ness → same key count → every key deep-equal.',
  tags: ['recursion', 'object', 'comparison', 'lodash-isequal']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'JSON.stringify',
    description: 'The one-liner. Correct only when key order matches and values are JSON-safe — say its failure modes out loud.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['One line', 'Fine for quick tests with controlled data'],
    cons: ['Key order breaks it', 'undefined values vanish', 'No Date/NaN/circular support'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (recursive)',
    description: 'Object.is for primitives, then array-ness check, key-count check, and recursion over keys.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(depth)',
    pros: ['Key order independent', 'NaN handled via Object.is', 'The expected interview answer'],
    cons: ['No circular-reference guard (add a seen-set if asked — same trick as JSON.stringify)'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function DeepEqualProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
