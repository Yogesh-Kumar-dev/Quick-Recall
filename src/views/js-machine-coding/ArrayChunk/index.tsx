// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/ArrayChunk');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Chunk an Array',
  description:
    'Implement chunk(array, size) that splits an array into sub-arrays of the given length, with the final chunk holding whatever remains. A lodash staple used for pagination and batching API calls.',
  examples: [
    {
      input: 'chunk([1, 2, 3, 4, 5], 2)',
      output: '[[1, 2], [3, 4], [5]]',
      explanation: 'Full pairs first; the leftover element becomes a smaller final chunk.'
    },
    {
      input: "chunk(['a', 'b', 'c'], 5)",
      output: "[['a', 'b', 'c']]",
      explanation: 'A size larger than the array yields one chunk with everything.'
    }
  ],
  constraints: ['The last chunk may be shorter than size.', 'size < 1 returns an empty array.', 'Do not mutate the input array.'],
  interviewTip:
    'The slice version is the one to reach for: "loop the start index in strides of size, slice each window — slice clamps at the end so the partial chunk is free." Two lines, no edge-case juggling.',
  tags: ['array', 'slice', 'lodash', 'pagination']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Bucket loop',
    description: 'Collect items into a bucket, flush at size, push the leftover at the end.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Works on any iterable, not just arrays', 'No index arithmetic'],
    cons: ['Leftover flush is easy to forget', 'More state to track'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'slice stride',
    description: 'for (start += size) + slice(start, start + size) — slice clamps past the end automatically.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['Two real lines', 'No partial-chunk special case', 'The answer interviewers expect'],
    cons: ['Array-only (slice needed)'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function ArrayChunkProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
