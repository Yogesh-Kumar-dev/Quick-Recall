// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/StarRating');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Star Rating Component',
  description: 'Build a reusable 5-star rating widget. Hovering over stars should preview the rating; clicking should lock it in.',
  requirements: [
    'Display 5 stars in a row',
    'Hovering over a star highlights it and all stars before it',
    'Clicking a star sets the permanent rating',
    'If you hover away, the display reverts to the permanent rating',
    'Show a text label below: Poor / Fair / Good / Very Good / Excellent',
    'Allow resetting the rating to 0 (no selection)'
  ],
  keyPatterns: ['onMouseEnter / onMouseLeave', 'onClick', 'Array.from({ length: 5 })'],
  interviewTip:
    'Use two state values: `rating` (permanent) and `hoverRating` (preview). To decide whether star #i should be filled: use `(hoverRating || rating) >= i`. onMouseLeave on the container resets hoverRating to 0.'
};

export default function StarRatingApp() {
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
