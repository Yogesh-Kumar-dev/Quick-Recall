// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/SearchFilter');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Search Filter',
  description:
    'Given a static list of items, build a search input that filters the list in real-time as the user types. No API calls, no debounce — purely synchronous filtering of an in-memory array.',
  requirements: [
    'Display a list of 20 items (frameworks, libraries, etc.)',
    'A search input filters the list as you type (case-insensitive)',
    'Show a "X of Y items" count below the input',
    'Show an empty state when no items match',
    'A clear (✕) button resets the query',
    'No debounce needed — synchronous filter is fine for small lists'
  ],
  keyPatterns: [
    'useState for query string',
    'Array.filter() + String.includes()',
    'toLowerCase() for case-insensitive match',
    'Derived filtered array (not in state)',
    'Controlled input'
  ],
  interviewTip:
    'Never put the filtered array in state — derive it inline: const filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase())). State holds only the query string. The filtered list recalculates on every render, which is fine for small arrays. For large datasets, useMemo would help.'
};

export default function SearchFilterApp() {
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
