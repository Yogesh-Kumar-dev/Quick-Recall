// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/ToastNotifications');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Toast Notifications',
  description:
    'Build a toast system: any component calls useToast() to pop a success/error/info message that stacks in a corner, auto-dismisses after 3s, and can be closed manually. Tests whether you can design an app-wide API with context, not just a component. Styling kept minimal on purpose.',
  requirements: [
    'A useToast() hook any descendant can call: toast(message, type)',
    'Toasts stack in a corner, newest at the bottom',
    'Each auto-dismisses after 3 seconds, independently',
    'Manual × dismiss per toast',
    'useToast outside the provider throws a clear error'
  ],
  keyPatterns: [
    'Context provides the addToast function (the API), state stays in the provider',
    'Unique id per toast; dismiss filters by id',
    'setTimeout(() => dismiss(id), 3000) — id-based removal avoids stale-closure bugs',
    'Functional setState in add/dismiss so rapid toasts never clobber each other'
  ],
  interviewTip:
    'Lead with the design: "context exposes ONE function; the toast array stays private in the provider." The follow-up trap is rapid-fire toasts — that\'s why every setState is functional and dismissal is by id, not by index. Mention createPortal for a real app (rendering above modals); it\'s omitted here to keep the demo self-contained.'
};

export default function ToastNotificationsProblem() {
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
