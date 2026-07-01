// ==============================|| RESOLVE CONTENT (refId → item) ||============================== //

// Bookmarks/reviews store only a `kind` + namespaced `refId`. This resolves that back to the
// real content item plus a route-stable URL, so the Saved view can render bookmarks without each
// feature re-implementing the lookup. Pure (no React) — it reads the same static `src/data` arrays.

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
import { reduxNotes } from '@/data/redux/redux-notes';
import { reduxToolkitNotes } from '@/data/redux/redux-toolkit-notes';
import { rtkQueryNotes } from '@/data/redux/rtk-query-notes';
import { asyncThunkNotes } from '@/data/redux/async-thunk-notes';
import { htmlNotes } from '@/data/htmlcss/html-notes';
import { cssNotes } from '@/data/htmlcss/css-notes';
import { engineeringNotes } from '@/data/engineering/engineering-notes';

// ─── Note lookup (by note.id) ─────────────────────────────────────────────────
// Note ids are unique within their arrays and, in practice, across the app; we merge then
// index by id. First-write-wins on the rare collision (deterministic).
const ALL_NOTES: Note[] = [
  ...jsNotes,
  ...tsNotes,
  ...tsReactNotes,
  ...reactNotes,
  ...nextjsNotes,
  ...nextjsRenderingNotes,
  ...reduxNotes,
  ...reduxToolkitNotes,
  ...rtkQueryNotes,
  ...asyncThunkNotes,
  ...htmlNotes,
  ...cssNotes,
  ...engineeringNotes
];

const noteById = new Map<string, Note>();
ALL_NOTES.forEach((n) => {
  if (!noteById.has(n.id)) noteById.set(n.id, n);
});

// ─── Problem lookup (by slug) + its route ─────────────────────────────────────
// JS and React problems live at different base paths.
const problemBySlug = new Map<string, { problem: BaseProblemEntry; url: string }>();
jsProblems.forEach((p) => {
  problemBySlug.set(p.slug, { problem: p, url: `/js/machine-coding/${p.slug}` });
});
reactMcProblems.forEach((p) => {
  problemBySlug.set(p.slug, { problem: p, url: `/react/machine-coding/${p.slug}` });
});

// ─── Resolved shapes ──────────────────────────────────────────────────────────

type ResolvedNote = { kind: 'note'; refId: string; note: Note };
type ResolvedFlashcard = { kind: 'flashcard'; refId: string; card: Flashcard };
type ResolvedProblem = { kind: 'problem'; refId: string; problem: BaseProblemEntry; url: string };
export type ResolvedContent = ResolvedNote | ResolvedFlashcard | ResolvedProblem;

// Returns the real content for a bookmark/review, or null if the refId no longer resolves
// (e.g. content removed since it was saved, or a not-yet-supported kind). Callers skip nulls.
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
