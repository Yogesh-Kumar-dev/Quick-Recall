// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/JsonStringify');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Implement JSON.stringify',
  description:
    'Re-implement JSON.stringify(value) for primitives, arrays, and plain objects. Looks scary, but it is one typeof switch plus recursion — the interviewer is really testing whether you know the weird serialization rules.',
  examples: [
    {
      input: "jsonStringify({ a: 1, b: 'hi', skip: undefined })",
      output: '\'{"a":1,"b":"hi"}\'',
      explanation: 'Object keys with undefined/function values are dropped entirely.'
    },
    {
      input: 'jsonStringify([1, undefined, NaN])',
      output: "'[1,null,null]'",
      explanation: 'In arrays the same values become null instead — a favorite gotcha.'
    }
  ],
  constraints: [
    'Strings are double-quoted; null serializes to "null".',
    'undefined/functions: dropped in objects, null in arrays.',
    'NaN and Infinity become null.',
    'Follow-ups: toJSON() support (Date), circular-reference TypeError, escaping quotes in strings.'
  ],
  interviewTip:
    'Structure your answer as three tiers and say so: (1) primitives via a typeof switch, (2) arrays/objects via recursion + join, (3) edge cases — undefined-vs-null asymmetry, toJSON, cycles. Interviewers usually stop you after tier 2 if tier 1 was clean.',
  tags: ['recursion', 'json', 'serialization', 'polyfill']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Core rules',
    description: 'typeof switch + recursion for arrays and objects, with the undefined-in-object vs undefined-in-array asymmetry handled.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(depth)',
    pros: ['Covers what a 30-minute round expects', 'Every rule is one visible line'],
    cons: ['No toJSON/Date support', 'No cycle detection', 'No string escaping'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'With edge cases',
    description: 'Adds toJSON() (how Date works), circular-structure TypeError via a seen-set, and string escaping.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(depth)',
    pros: ['Handles the three classic follow-ups', 'seen-set cycle detection is reusable in deep-clone too'],
    cons: ['Longer; write it only if asked to extend'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function JsonStringifyProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
