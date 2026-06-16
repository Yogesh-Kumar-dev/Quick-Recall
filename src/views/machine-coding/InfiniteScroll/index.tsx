// Server Component — readFileSync runs at next build (static generation)
import { readFileSync } from 'fs';
import { join } from 'path';
import ProblemLayout, { type ProblemMeta } from 'ui-component/machine-coding/ProblemLayout';
import MuiVersion from './MuiVersion';
import TsxVersion from './TsxVersion';
import JsxVersion from './JsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/InfiniteScroll');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');
const muiCode = readFileSync(join(BASE, 'MuiVersion.tsx'), 'utf-8');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: '🔴 Infinite Scroll',
  description:
    'Build a scrollable list that automatically fetches and appends more items when the user reaches the bottom — without a "Load More" button.',
  requirements: [
    'Render an initial batch of items on mount',
    'When the user scrolls to the bottom, automatically load the next batch',
    'Show a loading spinner while data is being fetched',
    'Stop loading when all data has been fetched (hasMore = false)',
    'Simulate an async API call with setTimeout (no real endpoint needed)'
  ],
  keyPatterns: ['IntersectionObserver', 'useRef (sentinel element)', 'useEffect (observer setup)', 'Loading state', 'hasMore flag'],
  interviewTip:
    'Place an invisible sentinel <div> at the bottom of the list. Attach an IntersectionObserver to it. When the sentinel enters the viewport, trigger loadMore(). Disconnect the observer in the cleanup function to avoid memory leaks.'
};

export default function InfiniteScrollApp() {
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
