// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import JsProblemShell from '@/components/machine-coding/js-problem-shell';
import type { JsProblemMeta, ApproachData } from '@/types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/MapLimit');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: 'Concurrency-Limited Task Runner (mapLimit)',
  description:
    'Implement mapLimit(items, limit, asyncFn): process every item with asyncFn, but with at most `limit` running at once, returning results in input order. THE async design question for experienced candidates — it is how you batch 500 API calls without melting the server.',
  examples: [
    {
      input: 'mapLimit([1,2,3,4,5,6], 2, fetchUser)',
      output: "['user-1', ..., 'user-6'] in input order",
      explanation: 'Only 2 fetches are in flight at any moment; as one finishes, the next item starts.'
    },
    {
      input: 'mapLimit(items, 1, fn)',
      output: 'strictly sequential processing',
      explanation: 'limit 1 degrades to a serial loop; limit ≥ items.length degrades to Promise.all.'
    }
  ],
  constraints: [
    'Never more than `limit` tasks in flight.',
    'Results must be in input order regardless of completion order.',
    'A finished task should immediately free its slot for the next item (no batch stalls).'
  ],
  interviewTip:
    'Offer the batched version first, then criticize it yourself: "a slow task blocks its whole batch." The pool version is the sentence "spawn `limit` workers that each loop: claim the next index, await it, repeat" — and note the shared cursor is race-free because JS is single-threaded.',
  tags: ['async', 'promise', 'concurrency', 'worker-pool']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Batched',
    description:
      'Chunk into groups of `limit`, Promise.all each group sequentially. Correct concurrency cap, but a slow task stalls its whole batch.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(n)',
    pros: ['4 lines with slice + Promise.all', 'Easy to verify correctness'],
    cons: ['Idle slots while a batch waits for its slowest task', 'Throughput suffers on uneven task durations'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Worker pool',
    description: '`limit` workers share a cursor; each loops claim-next-index → await → repeat. Slots never idle.',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(limit)',
    pros: ['True sliding-window concurrency', 'Results ordered by index for free', 'The answer senior interviews expect'],
    cons: ['The shared-cursor idea takes a minute to explain — practice saying it'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  }
];

export default function MapLimitProblem() {
  return <JsProblemShell problem={PROBLEM} approaches={APPROACHES} />;
}
