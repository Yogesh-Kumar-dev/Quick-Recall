// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/UndoRedo');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Undo / Redo',
  description:
    'Add undo/redo to a piece of state — here a counter with three operations. The classic useReducer question: the entire answer is choosing the right state shape. Works identically for text editors, canvases, or forms. Styling kept minimal on purpose.',
  requirements: [
    'Operations (−1, +1, ×2) change the value and are undoable',
    'Undo steps backward through history; Redo steps forward',
    'A NEW operation after undo clears the redo stack (like every editor)',
    'Undo/Redo buttons disable when their stack is empty',
    'Show the history stacks so behavior is inspectable'
  ],
  keyPatterns: [
    'State shape: { past: [], present, future: [] } — the whole pattern',
    'useReducer — three actions: SET, UNDO, REDO',
    'SET pushes present into past and CLEARS future',
    'UNDO/REDO shuttle values between the stacks immutably'
  ],
  interviewTip:
    'Say the state shape before any code: "past, present, future — undo moves present into future and pops the past; a new action clears future." That one sentence is 80% of the score. The generic follow-up ("make it a useHistory hook for any type") is the same reducer with a type parameter.'
};

export default function UndoRedoProblem() {
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
