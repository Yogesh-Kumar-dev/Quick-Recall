// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/PaginationDemo');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Pagination Component',
  description: 'Build a pagination control that splits a large dataset into pages and lets the user navigate between them.',
  requirements: [
    'Display a configurable number of items per page (5, 10, 20)',
    'Show previous / next buttons (disabled at boundaries)',
    'Show direct page number buttons with the current page highlighted',
    'Display "Showing X–Y of Z items" status text',
    'Changing items-per-page resets to page 1'
  ],
  keyPatterns: [
    'Math.ceil(total / perPage)',
    'Array.slice(start, end)',
    'Derived start/end indices',
    'Controlled select for perPage',
    'Boundary disabling'
  ],
  interviewTip:
    'Key formula: startIndex = (currentPage - 1) * itemsPerPage. endIndex = startIndex + itemsPerPage. currentItems = data.slice(startIndex, endIndex). Never store currentItems in state — derive it from currentPage + itemsPerPage + data.'
};

export default function PaginationApp() {
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
