// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/Counter');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟢 Counter',
  description:
    'Build a simple counter component with increment, decrement, and reset functionality. The classic first React component — demonstrates useState and event handlers.',
  requirements: [
    'Display the current count as a large number',
    'Increment button increases count by 1',
    'Decrement button decreases count by 1 (can go negative)',
    'Reset button sets count back to 0',
    'Show a status label: Positive / Negative / Zero',
    'Color the count green when positive, red when negative'
  ],
  keyPatterns: [
    'useState(0)',
    'Functional update: setCount(c => c + 1)',
    'Derived state (no extra useState for label)',
    'Event handlers onClick',
    'Conditional styling'
  ],
  interviewTip:
    'Always use functional updates when the new state depends on the previous state: setCount(c => c + 1) instead of setCount(count + 1). This avoids stale-closure bugs in async contexts. The label and color are derived values — never put them in state, compute them inline from count.'
};

export default function CounterApp() {
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
