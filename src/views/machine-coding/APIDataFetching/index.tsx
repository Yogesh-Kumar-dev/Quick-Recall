// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/APIDataFetching');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 API Data Fetching',
  description:
    'Fetch data from a public REST API and display it in a list. Handle all three async states: loading, error, and success. Uses the JSONPlaceholder API.',
  requirements: [
    'A "Fetch Posts" button triggers the API call',
    'Show a loading state (spinner or skeleton) while fetching',
    'Display the fetched posts in a list once loaded',
    'Handle fetch errors — show an error message',
    'A "Refresh" button re-fetches the data',
    'Show skeleton placeholders while loading (not just a spinner)',
    'Display post id, title, and body excerpt per item'
  ],
  keyPatterns: [
    'data: Post[] state (default [])',
    'loading: boolean state',
    'error: string | null state',
    'async fetchData() with try/catch/finally',
    'finally { setLoading(false) } — always runs',
    'fetched flag to distinguish "not yet loaded" from "loaded 0 items"'
  ],
  interviewTip:
    'The three-state pattern: data (what to show), loading (show skeleton/spinner), error (show error message). Always use a try/catch/finally block — put setLoading(false) in finally so it runs even if the fetch throws. Check res.ok before parsing JSON: if (!res.ok) throw new Error(`HTTP ${res.status}`). Keep a separate `fetched` flag to distinguish initial state from loaded-but-empty.'
};

export default function APIDataFetchingApp() {
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
