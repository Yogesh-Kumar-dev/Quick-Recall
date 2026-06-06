// Server Component — readFileSync runs at build time
import { readFileSync } from 'fs';
import { join } from 'path';
import JsProblemLayout from 'ui-component/js-problem/JsProblemLayout';
import type { JsProblemMeta, ApproachData } from 'types/content';

const BASE = join(process.cwd(), 'src/views/js-machine-coding/ElectricityBill');

const bruteCode = readFileSync(join(BASE, 'solution-brute.js'), 'utf-8');
const optimalCode = readFileSync(join(BASE, 'solution-optimal.js'), 'utf-8');
const builtinCode = readFileSync(join(BASE, 'solution-builtin.js'), 'utf-8');

const PROBLEM: JsProblemMeta = {
  title: '🟢 Calculate Electricity Bill',
  description:
    'Given a number of consumed units, calculate the total electricity bill using tiered (slab-based) pricing. Each slab covers a band of units at a fixed per-unit rate, and any units beyond the last fixed slab are charged at the top rate. This is a classic "slab/bracket" problem (the same shape as income-tax calculation) that tests whether you can turn a rule table into clean, maintainable code.',
  examples: [
    {
      input: 'units = 230',
      output: '₹1500',
      explanation: '100×₹5 (500) + 100×₹7 (700) + 30×₹10 (300) = ₹1500.'
    },
    {
      input: 'units = 120',
      output: '₹640',
      explanation: '100×₹5 (500) + 20×₹7 (140) = ₹640.'
    },
    {
      input: 'units = 90',
      output: '₹450',
      explanation: 'All 90 units fall in the first slab: 90×₹5.'
    },
    {
      input: 'units = 0',
      output: '₹0'
    }
  ],
  constraints: [
    'Slabs: 0–100 → ₹5/unit, 101–200 → ₹7/unit, 201–300 → ₹10/unit, above 300 → ₹12/unit.',
    'Each slab rate applies only to the units within that band (marginal pricing), not the whole bill.',
    'units is a non-negative number; 0 units → ₹0.'
  ],
  interviewTip:
    'The trap is to charge the whole amount at one rate based on the total — the rates are MARGINAL, like tax brackets. Lead with the if/else version to show you understand the slabs, then refactor to the data-driven table and point out that a tariff change becomes a one-line data edit instead of a logic rewrite.',
  tags: ['math', 'slab-pricing', 'array', 'reduce', 'logic']
};

const APPROACHES: ApproachData[] = [
  {
    label: 'Brute Force',
    description:
      'A hardcoded if / else-if chain, one branch per slab boundary. Easiest to read and explain, and a fine first answer — but every tariff change forces you to rewrite the branches and re-derive the cumulative constants.',
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    pros: ['Trivial to understand', 'No data structures needed', 'Obviously correct'],
    cons: ['Constants are duplicated and error-prone', 'Adding/changing a slab means editing logic', 'Does not generalise'],
    code: bruteCode,
    filename: 'solution-brute.js'
  },
  {
    label: 'Optimal (Slab Table)',
    description:
      'Model the tariff as an array of { limit, rate } slabs and loop over it, consuming up to each slab’s limit and carrying the remainder forward. The preferred answer: the loop never changes, only the data does.',
    timeComplexity: 'O(s)',
    spaceComplexity: 'O(1)',
    pros: [
      'Tariff changes are a data edit, not a logic change',
      'No duplicated magic numbers',
      'Same shape solves tax brackets, shipping tiers, etc.'
    ],
    cons: ['Marginally more setup than a plain if/else'],
    code: optimalCode,
    filename: 'solution-optimal.js'
  },
  {
    label: 'Functional (reduce)',
    description:
      'The same data-driven idea expressed as a single reduce that threads a { total, remaining } accumulator through the slabs. Concise and side-effect-free — good for showing functional fluency.',
    timeComplexity: 'O(s)',
    spaceComplexity: 'O(1)',
    pros: ['No mutation', 'Compact', 'Reuses the slab table'],
    cons: ['The accumulator object is a little harder to read aloud than the imperative loop'],
    code: builtinCode,
    filename: 'solution-builtin.js'
  }
];

export default function ElectricityBillProblem() {
  return <JsProblemLayout problem={PROBLEM} approaches={APPROACHES} />;
}
