// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/TicTacToe');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Tic-Tac-Toe',
  description:
    'Build a playable tic-tac-toe game: alternating turns, win/draw detection, restart. Probably the single most-asked React machine-coding question — it measures how little state you can get away with. Styling kept minimal on purpose.',
  requirements: [
    '3×3 grid; clicking an empty cell places X or O, alternating',
    'Occupied cells and finished games ignore clicks',
    'Detect and announce a winner across rows, columns, diagonals',
    'Detect a draw when the board fills with no winner',
    'Restart button clears the game'
  ],
  keyPatterns: [
    'One state array of 9 cells + a boolean for whose turn',
    'Winner/draw/status all DERIVED — never stored in state',
    'Immutable update: copy the array before writing',
    'Winning lines as a constant array of index triples'
  ],
  interviewTip:
    'Say your state design before coding: "Two pieces of state — the 9-cell array and whose turn. Winner and draw are derived every render from the board." Storing winner in state is the red flag interviewers watch for. The LINES constant beats clever row/column math — boring and correct.'
};

export default function TicTacToeProblem() {
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
