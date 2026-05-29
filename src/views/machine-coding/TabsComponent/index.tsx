// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/TabsComponent');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🟡 Tabs Component',
  description:
    'Build a custom tabs component from scratch. Clicking a tab shows its content panel. Implement keyboard navigation (← → arrow keys) and a lazy-mount strategy so heavy content is only rendered the first time its tab is opened.',
  requirements: [
    'Render a row of tab buttons; clicking activates that tab',
    'Show the content panel for the active tab only',
    'Keyboard navigation: arrow keys move focus between tabs; Enter/Space activates',
    "Lazy mount: a tab's content is NOT rendered until the tab is first opened",
    'Once mounted, keep the tab content in the DOM but hide it (CSS display:none) — avoids re-mounting on every switch',
    'Add an "Unread" badge count to some tabs to test props/state'
  ],
  keyPatterns: [
    'activeTab: number',
    'mountedTabs: Set<number>',
    'display: none vs unmount',
    'useRef for tab elements',
    'onKeyDown arrow navigation'
  ],
  interviewTip:
    "The lazy-mount + keep-alive pattern: when a tab opens, add its index to mountedTabs (Set). In render: always output the panel div but set display:none when inactive. Only render the panel's children if mountedTabs.has(index). This gives you: no wasted render on first load, no state loss on tab switch."
};

export default function TabsApp() {
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
