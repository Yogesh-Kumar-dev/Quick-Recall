// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/PaginationDemo');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

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
    <ProblemShell
      problem={PROBLEM}
      versions={{
        jsx: { component: <JsxVersion />, code: jsxCode },
        tsx: { component: <TsxVersion />, code: tsxCode }
      }}
    />
  );
}
