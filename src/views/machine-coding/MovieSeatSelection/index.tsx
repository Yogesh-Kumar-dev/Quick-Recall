// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/MovieSeatSelection');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Movie Seat Selection',
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
    <ProblemLayout
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode },
        mui: { component: <MuiVersion />, code: muiCode }
      }}
    />
  );
}
