// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/APIDataFetching');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'API Data Fetching',
  description:
    'Fetch data from a public REST API and display it in a list. Model the request lifecycle — idle, loading, success, error — as one status value rather than parallel boolean flags. Uses the JSONPlaceholder API.',
  requirements: [
    'A "Fetch Posts" button triggers the API call ("Refresh" once loaded)',
    'Show a loading state (skeleton) while fetching',
    'Display the fetched posts once loaded; show an error message on failure',
    'Distinguish the initial idle state from a loaded-but-empty result'
  ],
  keyPatterns: [
    'one status: idle | loading | success | error — not parallel loading/error/fetched flags',
    'discriminated union so the error message lives only in the error case',
    'check res.ok before parsing JSON, throw on failure → caught as error',
    'data stored separately; each terminal status sets its own end state (no finally reset)'
  ],
  interviewTip:
    'Two booleans (loading + error) are perfectly fine for a single fetch — don\'t reach for more ceremony than the problem needs. The senior signal is naming the tradeoff: as soon as states can contradict each other ("loading AND error" at once) or you need an idle state distinct from "loaded 0 items", collapse them into one status (idle → loading → success | error) so illegal states become unrepresentable. In TS a discriminated union ({ status: "error"; message } | …) lets the compiler guarantee you only read the message in the error branch. Knowing when NOT to use it matters as much as knowing the pattern. Either way, check res.ok before parsing JSON: if (!res.ok) throw new Error("HTTP " + res.status).'
};

export default function APIDataFetchingApp() {
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
