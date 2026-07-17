// Server Component — readFileSync runs at build time (static generation)
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import ProblemShell from '@/components/machine-coding/problem-shell';
import type { ProblemMeta } from '@/types/content';
import JsxVersion from './JsxVersion';
import TsxVersion from './TsxVersion';

const BASE = join(process.cwd(), 'src/views/machine-coding/NestedComments');
const jsxCode = readFileSync(join(BASE, 'JsxVersion.jsx'), 'utf-8');
const tsxCode = readFileSync(join(BASE, 'TsxVersion.tsx'), 'utf-8');

const PROBLEM: ProblemMeta = {
  title: 'Nested Comments',
  description:
    'Build a Reddit-style comment thread: comments nest to any depth and every comment can be replied to in place. The definitive recursion question in React — rendering a tree is easy, updating it immutably at depth is the real test. Styling kept minimal on purpose.',
  requirements: [
    'Render comments nested to arbitrary depth with visual indentation',
    'Every comment has a Reply toggle revealing an inline input',
    'Posting a reply appends it under that comment, at any depth',
    'Empty replies are rejected; the box closes after posting',
    'State updates must be immutable (no mutating the tree)'
  ],
  keyPatterns: [
    'Recursive component: <Comment> renders its replies as <Comment>s',
    'Recursive immutable update: map the tree, spread the matched node',
    'Reply-box state lives in each Comment (local), the tree lives at the top',
    'Single onReply callback threaded down unchanged'
  ],
  interviewTip:
    'Say the two halves out loud: "recursive component for display, recursive helper for updates — the update helper mirrors the component structure." Keeping the reply-box open/closed state LOCAL to each comment (not in the tree) is the design choice interviewers probe.'
};

export default function NestedCommentsProblem() {
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
