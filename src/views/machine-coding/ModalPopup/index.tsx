// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/ModalPopup');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Modal Popup',
  description:
    'Build a reusable modal dialog component. A button triggers it to open; it can be closed via the backdrop, a close button, or the Escape key.',
  requirements: [
    'A button opens the modal overlay',
    'Modal has a header (title + close button) and body content',
    'Clicking the dark backdrop closes the modal',
    'Pressing Escape closes the modal',
    'Background scroll is locked while modal is open',
    'Build a confirmation modal variant (Cancel + Confirm buttons)',
    'Modal is reusable — accepts title and children as props'
  ],
  keyPatterns: [
    'isOpen: boolean state',
    'useEffect for Escape key listener + scroll lock',
    'onClick backdrop: e.target === e.currentTarget check',
    'Conditional render: if (!isOpen) return null',
    'Fixed overlay with flexbox centering'
  ],
  interviewTip:
    "Two key patterns: (1) Backdrop click — use onClick on the overlay div, check if e.target === e.currentTarget so clicks on the dialog content don't bubble and close it. (2) Escape key — add a keydown listener in useEffect, check e.key === 'Escape', and ALWAYS clean up the listener in the return function. Set document.body.style.overflow = 'hidden' when open to prevent background scroll."
};

export default function ModalPopupApp() {
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
