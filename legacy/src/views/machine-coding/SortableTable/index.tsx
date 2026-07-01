// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/SortableTable');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Sortable Employee Table',
  description:
    'Render 10 static employee records in a table. Expose a few sortable fields as clickable chips (Name, Age, Salary); clicking a chip sorts the dataset by that field, and clicking the active chip again flips the direction between ascending and descending. No API call — the data is hard-coded.',
  requirements: [
    'Render the static employee list in a table (name, age, department, salary)',
    'Show a chip per sortable field (2–3 chips)',
    'Clicking a chip sorts the rows by that field',
    'Clicking the already-active chip toggles asc ↔ desc',
    'Indicate the active field and direction (highlight + ↑/↓ arrow)',
    'Sort strings and numbers correctly (localeCompare vs numeric subtraction)',
    'Keep styling minimal — focus on the sort logic and state, not visual polish'
  ],
  keyPatterns: [
    'sort state = { key, dir } — a single descriptor, not one flag per column',
    'sorted rows derived via useMemo from (data, sort) — never stored in state',
    'sort a COPY: [...data].sort(...) — Array.sort mutates in place',
    'numeric compare (a - b) vs string localeCompare, scaled by a ±1 direction factor'
  ],
  interviewTip:
    'Model sorting as one { key, dir } object rather than a separate flag per column — it makes "only one active sort at a time" automatic and the toggle trivial. Always sort a copy ([...data]) because Array.prototype.sort mutates in place; mutating the source array is a subtle bug that corrupts your "unsorted" baseline. Use a direction factor (asc ? 1 : -1) so one comparator handles both directions, and branch on field type: numeric fields use (a - b), string fields use localeCompare.'
};

export default function SortableTableApp() {
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
