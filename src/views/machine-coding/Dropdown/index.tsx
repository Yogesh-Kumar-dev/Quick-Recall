// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/Dropdown');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Dropdown / Custom Select',
  description:
    'Build a custom dropdown select component from scratch. Clicking the trigger opens a list of options; selecting one closes the list and updates the displayed value.',
  requirements: [
    'A trigger button shows the selected value (or placeholder)',
    'Clicking the trigger toggles the dropdown list',
    'Clicking an option selects it and closes the dropdown',
    'Clicking outside the dropdown closes it (click-outside handler)',
    'Pressing Escape closes the dropdown',
    'Highlight the currently selected option in the list',
    'Arrow rotates 180° when the dropdown is open'
  ],
  keyPatterns: [
    'isOpen: boolean state',
    'selected: string | null state',
    'useRef + document.addEventListener (click-outside)',
    'useEffect cleanup for event listeners',
    'Conditional rendering for the list'
  ],
  interviewTip:
    "The click-outside pattern is the key interview question: attach a mousedown listener to document inside a useEffect, and check if containerRef.current.contains(e.target). If false, close the dropdown. Always return the cleanup function to remove the listener. Don't forget the Escape key listener in a separate useEffect."
};

export default function DropdownApp() {
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
