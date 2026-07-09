// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/MovieSeatSelection');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Movie Seat Selection',
  description:
    'Build a minimal cinema seat-booking UI. Render a seat grid where each seat is available, selected, or already booked. Clicking an available seat selects it (click again to deselect); a live footer shows how many seats are picked and the total price. Pressing Book confirms the selection — those seats become booked and the selection resets.',
  requirements: [
    'Render a grid of seats with row labels (A–F) and a screen indicator',
    'Each seat is one of: available, selected, or booked (unavailable)',
    'Clicking an available seat toggles it selected ↔ available',
    'Booked seats are not clickable',
    'Show a live count and total price for the current selection',
    'Book button (disabled when nothing is selected) confirms: selected → booked, clear selection'
  ],
  keyPatterns: [
    'useState (set of selected ids)',
    'derived total & count',
    'pre-seeded booked seats',
    'conditional styling',
    'disabled interaction'
  ],
  interviewTip:
    'Keep only the selected seat ids in state (a Set or array) and DERIVE the count and total price inline during render — never store them as separate state, or they can drift out of sync. Booked seats come from the initial data and are simply non-interactive; on Book you merge the selection into the booked set and clear the selection.'
};

export default function MovieSeatSelectionApp() {
  return (
    <ProblemShell
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode }
      }}
    />
  );
}
