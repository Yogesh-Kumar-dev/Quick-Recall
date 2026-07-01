// ==============================|| RESOLVE CONTENT (refId → item) ||============================== //

// Bookmarks/reviews store only a `kind` + namespaced `refId`. This resolves that back to the
// real content item plus a route-stable URL to link to its source, so the Saved view can
// render bookmarks without each feature re-implementing the lookup. Pure (no React/Redux) —
// it reads the same static `src/data` arrays the Redux store is seeded from.

import type { BaseProblemEntry, Flashcard, Note } from 'types/content';
import type { BookmarkKind } from 'types/study';

import { flashcardByKey } from 'data/flashcards-index';

// Notes
import { jsNotes, tsNotes, tsReactNotes } from 'data/javascript';
import { reactNotes } from 'data/react';
import { nextjsNotes, nextjsRenderingNotes } from 'data/nextjs';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes } from 'data/redux';
import { htmlNotes, cssNotes } from 'data/htmlcss';
import { engineeringNotes } from 'data/engineering';

// Problems
import { jsProblems } from 'data/javascript';
import { reactMcProblems } from 'data/react';

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
// JS and React problems live at different base paths (mirrors search-index.ts).
const problemBySlug = new Map<string, { problem: BaseProblemEntry; url: string }>();
jsProblems.forEach((p) => problemBySlug.set(p.slug, { problem: p, url: `/js/machine-coding/${p.slug}` }));
reactMcProblems.forEach((p) => problemBySlug.set(p.slug, { problem: p, url: `/machine-coding/${p.slug}` }));

// ─── Resolved shapes ──────────────────────────────────────────────────────────

type ResolvedNote = { kind: 'note'; refId: string; note: Note };
type ResolvedFlashcard = { kind: 'flashcard'; refId: string; card: Flashcard };
type ResolvedProblem = { kind: 'problem'; refId: string; problem: BaseProblemEntry; url: string };
export type ResolvedContent = ResolvedNote | ResolvedFlashcard | ResolvedProblem;

// Returns the real content for a bookmark/review, or null if the refId no longer resolves
// (e.g. content removed since it was saved). Callers should skip nulls gracefully.
export function resolveContent(kind: BookmarkKind, refId: string): ResolvedContent | null {
  if (kind === 'note') {
    const note = noteById.get(refId);
    return note ? { kind, refId, note } : null;
  }
  if (kind === 'flashcard') {
    const indexed = flashcardByKey.get(refId);
    return indexed ? { kind, refId, card: indexed.card } : null;
  }
  // problem
  const hit = problemBySlug.get(refId);
  return hit ? { kind, refId, problem: hit.problem, url: hit.url } : null;
}
