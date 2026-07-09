// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/TodoApp');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Todo List with Filters',
  description:
    'Build a fully functional todo list where users can add tasks, mark them complete, delete them, and filter the list by status.',
  requirements: [
    'Add a new todo by typing in an input and pressing Enter or clicking Add',
    'Mark any todo as complete/incomplete via a checkbox',
    'Delete any todo with a remove button',
    'Filter the list: All | Active (incomplete) | Completed',
    'Display a count of remaining (incomplete) items at the bottom',
    'Persist state across filter changes without losing todos'
  ],
  keyPatterns: ['useState', 'useMemo (derived state)', 'Array.filter()', 'Array.map()', 'Controlled input'],
  interviewTip:
    'Avoid duplicating state. The filtered list is DERIVED from todos + filter — compute it with useMemo, never store it separately in state.'
};

export default function TodoApp() {
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
