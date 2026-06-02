// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/VirtualizedList');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🔴 Virtualized List',
  description:
    'Render a list of 100 items — each labelled "div 1", "div 2" … "div 100". The JSX/TSX versions reveal the items in batches as the user scrolls, using an IntersectionObserver sentinel. The MUI version shows the alternative: windowing with react-window, where only the visible rows ever exist in the DOM. Switch between the versions to compare the two techniques.',
  requirements: [
    'Render 100 items, each showing the label "div N" (1-indexed)',
    'JSX/TSX: start with a small batch and reveal more as a bottom sentinel scrolls into view',
    'Use an IntersectionObserver attached to a sentinel element (no scroll listener)',
    'Stop revealing once all 100 items are shown',
    'MUI: render the full 100 through react-window so only on-screen rows are mounted'
  ],
  keyPatterns: ['IntersectionObserver', 'sentinel ref', 'batch reveal', 'react-window FixedSizeList', 'windowing / overscan'],
  interviewTip:
    'These solve different problems. The observer "reveal" approach still MOUNTS every revealed node, so the DOM keeps growing — fine for 100 items. Virtualization (react-window) keeps a roughly constant number of nodes in the DOM regardless of list size by only rendering the rows in (and just around) the viewport — essential for thousands of items. The trade-off: virtualization needs a fixed/known row height and you must spread the library-provided `style` onto each row for absolute positioning to work.'
};

export default function VirtualizedListApp() {
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
