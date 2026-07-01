// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/DebouncedSearch');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Debounced Search / Typeahead',
  description:
    'Build a search box that filters a list of results — but only after the user stops typing for 400ms, not on every single keystroke.',
  requirements: [
    'Render a text input for search queries',
    'Debounce the search: wait 400ms after the last keystroke before filtering',
    'Show a loading indicator during the debounce delay',
    'Display filtered results (filter from a static mock dataset)',
    'Show "No results found" when the query matches nothing',
    'Clear button resets both input and results'
  ],
  keyPatterns: [
    'useDebounce hook',
    'useEffect + setTimeout/clearTimeout',
    'Cleanup (cancel timer on unmount)',
    'Controlled input',
    'Loading state'
  ],
  interviewTip:
    'The key is the cleanup in useEffect: return () => clearTimeout(timer). If the user types again before 400ms, the old timer is cancelled and a new one starts. Without cleanup, every keystroke fires a search and you get race conditions.'
};

export default function DebouncedSearch() {
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
