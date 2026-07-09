// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/DragAndDrop');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Drag & Drop Kanban Board',
  description:
    'Build a 3-column Kanban board (Todo → In Progress → Done) where task cards can be dragged from one column and dropped into another. No external drag-and-drop library.',
  requirements: [
    '3 columns: Todo, In Progress, Done',
    'Each column has a list of draggable task cards',
    'Drag a card from any column and drop it into any other column',
    'The card moves from the source column to the target column',
    'Visual feedback: highlight the drop target column on drag-over',
    'No external DnD library — use only the HTML5 Drag and Drop API'
  ],
  keyPatterns: [
    'draggable attribute',
    'onDragStart → dataTransfer.setData',
    'onDragOver → e.preventDefault()',
    'onDrop → dataTransfer.getData',
    'Immutable state update',
    'dragRef (useRef) vs dataTransfer'
  ],
  interviewTip:
    "onDragOver must call e.preventDefault() — without it, the browser will not fire onDrop. Store the dragged card's ID + source column in a useRef (not state!) so you don't trigger re-renders during drag. Only update state on drop."
};

export default function DragAndDropApp() {
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
