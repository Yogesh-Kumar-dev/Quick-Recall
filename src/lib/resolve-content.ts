// ==============================|| RESOLVE CONTENT (refId → item) ||============================== //

// Bookmarks/reviews store only a `kind` + namespaced `refId`; this resolves that back to the
// real content item plus a route-stable URL so the Saved view doesn't re-implement the lookup.

import type { BaseProblemEntry, Flashcard, Note } from '@/types/content';
import type { BookmarkKind } from '@/types/study';

import { flashcardByKey } from '@/data/flashcards-index';

// Problems
import { jsProblems } from '@/data/javascript/js-problems';
import { reactMcProblems } from '@/data/react/react-mc-problems';

// Notes
import { jsNotes } from '@/data/javascript/js-notes';
import { tsNotes } from '@/data/javascript/ts-notes';
import { tsReactNotes } from '@/data/javascript/ts-react';
import { reactNotes } from '@/data/react/react-notes';
import { nextjsNotes } from '@/data/nextjs/nextjs-notes';
import { nextjsRenderingNotes } from '@/data/nextjs/nextjs-rendering';
import { nodejsNotes } from '@/data/nodejs/nodejs-notes';
import { reduxNotes } from '@/data/redux/redux-notes';
import { reduxToolkitNotes } from '@/data/redux/redux-toolkit-notes';
import { rtkQueryNotes } from '@/data/redux/rtk-query-notes';
import { asyncThunkNotes } from '@/data/redux/async-thunk-notes';
import { htmlNotes } from '@/data/htmlcss/html-notes';
import { cssNotes } from '@/data/htmlcss/css-notes';
import { engineeringNotes } from '@/data/engineering/engineering-notes';
import { webSecurityNotes } from '@/data/web/web-security-notes';
import { authNotes } from '@/data/web/auth-notes';
import { accessibilityNotes } from '@/data/web/accessibility-notes';
import { webPerformanceNotes } from '@/data/web/web-performance-notes';

// ─── Note lookup (by note.id) ─────────────────────────────────────────────────
// First-write-wins on an id collision across topics (deterministic).
const ALL_NOTES: Note[] = [
  ...jsNotes,
  ...tsNotes,
  ...tsReactNotes,
  ...reactNotes,
  ...nextjsNotes,
  ...nextjsRenderingNotes,
  ...nodejsNotes,
  ...reduxNotes,
  ...reduxToolkitNotes,
  ...rtkQueryNotes,
  ...asyncThunkNotes,
  ...htmlNotes,
  ...cssNotes,
  ...engineeringNotes,
  ...webSecurityNotes,
  ...authNotes,
  ...accessibilityNotes,
  ...webPerformanceNotes
];

const noteById = new Map<string, Note>();
ALL_NOTES.forEach((n) => {
  if (!noteById.has(n.id)) noteById.set(n.id, n);
});

// ─── Problem lookup (by slug) + its route ─────────────────────────────────────
// JS and React problems share this slug namespace (reviews/bookmarks store bare slugs) —
// a collision would silently point saved items at the wrong problem, hence the dev warning.
const problemBySlug = new Map<string, { problem: BaseProblemEntry; url: string }>();
jsProblems.forEach((p) => {
  problemBySlug.set(p.slug, { problem: p, url: `/js/machine-coding/${p.slug}` });
});
reactMcProblems.forEach((p) => {
  if (process.env.NODE_ENV !== 'production' && problemBySlug.has(p.slug)) {
    console.warn(`resolve-content: duplicate problem slug "${p.slug}" — JS and React machine-coding slugs must not collide`);
  }
  problemBySlug.set(p.slug, { problem: p, url: `/react/machine-coding/${p.slug}` });
});

// ─── Resolved shapes ──────────────────────────────────────────────────────────

type ResolvedNote = { kind: 'note'; refId: string; note: Note };
type ResolvedFlashcard = { kind: 'flashcard'; refId: string; card: Flashcard };
type ResolvedProblem = { kind: 'problem'; refId: string; problem: BaseProblemEntry; url: string };
export type ResolvedContent = ResolvedNote | ResolvedFlashcard | ResolvedProblem;

// Null if the refId no longer resolves (content removed since saved); callers skip nulls.
export function resolveContent(kind: BookmarkKind, refId: string): ResolvedContent | null {
  if (kind === 'note') {
    const note = noteById.get(refId);
    return note ? { kind, refId, note } : null;
  }
  if (kind === 'flashcard') {
    const indexed = flashcardByKey.get(refId);
    return indexed ? { kind, refId, card: indexed.card } : null;
  }
  // problem — refId is the problem slug
  const hit = problemBySlug.get(refId);
  return hit ? { kind, refId, problem: hit.problem, url: hit.url } : null;
}
