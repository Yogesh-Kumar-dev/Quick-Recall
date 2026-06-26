// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/ProductFilter');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Product Filter',
  description:
    'Fetch a product catalog from a REST API, then let the user narrow it down with a category dropdown and a debounced search box. Both filters combine, and the visible list is derived from the source data — never stored separately. Uses the Fake Store API.',
  requirements: [
    'Fetch all products once on mount; handle loading and error states',
    'Build the category dropdown dynamically from the fetched data (plus an "All" option)',
    'Selecting a category filters the list',
    'A search box filters by title, debounced (~300ms) so it does not filter on every keystroke',
    'Category + search filters apply together',
    'Show a "no products match" empty state',
    'Show a live count of visible products',
    'Keep styling minimal — the focus is the data flow and state, not visual polish'
  ],
  keyPatterns: [
    'visible list = useMemo over (allProducts, category, debounced) — derived, not stored',
    'debounce: useEffect mirrors search → debounced via setTimeout, cleared on each keystroke',
    'derive categories with [...new Set(products.map(p => p.category))]',
    'one request status (loading | success | error) instead of parallel flags'
  ],
  interviewTip:
    'The trap is storing a separate `filteredProducts` state and writing to it inside the change handlers — two sources of truth that drift apart. Instead derive the visible list with useMemo from (data, category, debouncedSearch). For the debounce, keep the raw input value in `search` for a responsive field, and mirror it into `debounced` via a useEffect + setTimeout whose cleanup clears the pending timer — filtering reads only `debounced`. Derive categories from the data so the dropdown stays in sync automatically.'
};

export default function ProductFilterApp() {
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
