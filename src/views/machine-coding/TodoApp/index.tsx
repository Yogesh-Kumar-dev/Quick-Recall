// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/TodoApp');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Todo List with Filters',
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
