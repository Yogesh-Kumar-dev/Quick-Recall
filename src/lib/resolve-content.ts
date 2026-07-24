// ==============================|| RESOLVE CONTENT (refId → item) ||============================== //

// Bookmarks/reviews store only a `kind` + namespaced `refId`; this resolves that back to the
// real content item plus a route-stable URL so the Saved view doesn't re-implement the lookup.

import type { BaseProblemEntry, Flashcard, Note } from '@/types/content';
import type { BookmarkKind } from '@/types/study';

import { flashcardByKey } from '@/data/flashcards-index';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';

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
import { postgresqlNotes } from '@/data/databases/postgresql-notes';
import { mongodbNotes } from '@/data/databases/mongodb-notes';
import { redisNotes } from '@/data/databases/redis-notes';
import { dynamodbNotes } from '@/data/databases/dynamodb-notes';
import { testingFundamentalsNotes } from '@/data/testing/testing-fundamentals-notes';
import { vitestNotes } from '@/data/testing/vitest-notes';
import { rtlNotes } from '@/data/testing/rtl-notes';
import { jestNotes } from '@/data/testing/jest-notes';
import { mswNotes } from '@/data/testing/msw-notes';
import { supertestNotes } from '@/data/testing/supertest-notes';
import { playwrightNotes } from '@/data/testing/playwright-notes';
import { etlTestingNotes } from '@/data/testing/etl-testing-notes';
import { pentestNotes } from '@/data/testing/pentest-notes';
import { mobileTestingNotes } from '@/data/testing/mobile-testing-notes';
import { webTestingNotes } from '@/data/testing/web-testing-notes';
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

// ─── Note lookup (by note.id) with URL mapping ──────────────────────────────
// First-write-wins on an id collision across topics (deterministic).
interface NoteWithUrl {
  note: Note;
  url: string;
}

function noteEntry(notes: Note[], basePath: string): NoteWithUrl[] {
  return notes.map((n) => ({ note: n, url: `${basePath}?open=${n.id}` }));
}

const ALL_NOTES_WITH_URL: NoteWithUrl[] = [
  ...noteEntry(jsNotes, '/js/notes'),
  ...noteEntry(tsNotes, '/js/typescript'),
  ...noteEntry(tsReactNotes, '/js/ts-for-react'),
  ...noteEntry(reactNotes, '/react/notes'),
  ...noteEntry(nextjsNotes, '/nextjs/notes'),
  ...noteEntry(nextjsRenderingNotes, '/nextjs/rendering'),
  ...noteEntry(nodejsNotes, '/nodejs/notes'),
  ...noteEntry(postgresqlNotes, '/databases/postgresql'),
  ...noteEntry(mongodbNotes, '/databases/mongodb'),
  ...noteEntry(redisNotes, '/databases/redis'),
  ...noteEntry(dynamodbNotes, '/databases/dynamodb'),
  ...noteEntry(testingFundamentalsNotes, '/testing/fundamentals'),
  ...noteEntry(vitestNotes, '/testing/tools'),
  ...noteEntry(rtlNotes, '/testing/tools'),
  ...noteEntry(jestNotes, '/testing/tools'),
  ...noteEntry(mswNotes, '/testing/tools'),
  ...noteEntry(supertestNotes, '/testing/tools'),
  ...noteEntry(playwrightNotes, '/testing/tools'),
  ...noteEntry(etlTestingNotes, '/testing/specialized'),
  ...noteEntry(pentestNotes, '/testing/specialized'),
  ...noteEntry(mobileTestingNotes, '/testing/specialized'),
  ...noteEntry(webTestingNotes, '/testing/specialized'),
  ...noteEntry(reduxNotes, '/redux/notes'),
  ...noteEntry(reduxToolkitNotes, '/redux/toolkit'),
  ...noteEntry(rtkQueryNotes, '/redux/rtk-query'),
  ...noteEntry(asyncThunkNotes, '/redux/async-thunk'),
  ...noteEntry(htmlNotes, '/html-css/html'),
  ...noteEntry(cssNotes, '/html-css/css'),
  ...noteEntry(engineeringNotes, '/engineering/notes'),
  ...noteEntry(webSecurityNotes, '/web/security'),
  ...noteEntry(authNotes, '/web/auth'),
  ...noteEntry(accessibilityNotes, '/web/accessibility'),
  ...noteEntry(webPerformanceNotes, '/web/performance')
];

const noteById = new Map<string, NoteWithUrl>();
ALL_NOTES_WITH_URL.forEach((entry) => {
  if (!noteById.has(entry.note.id)) noteById.set(entry.note.id, entry);
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

// ─── Flashcard URL helper ─────────────────────────────────────────────────────
// Flashcard refId format is "source:cardId" — map source to URL slug + card query param.
// Derived from FLASHCARD_SETS (slug → source) so the two never drift apart.
const sourceToSlug: Record<string, string> = Object.fromEntries(Object.entries(FLASHCARD_SETS).map(([slug, set]) => [set.source, slug]));

function getFlashcardUrl(refId: string): string {
  const [source, cardId] = refId.split(':');
  const slug = sourceToSlug[source] ?? source;
  return `/flashcards/${slug}?card=${cardId}`;
}

// ─── Resolved shapes ──────────────────────────────────────────────────────────

type ResolvedNote = { kind: 'note'; refId: string; note: Note; url: string };
type ResolvedFlashcard = { kind: 'flashcard'; refId: string; card: Flashcard; url: string };
type ResolvedProblem = { kind: 'problem'; refId: string; problem: BaseProblemEntry; url: string };
export type ResolvedContent = ResolvedNote | ResolvedFlashcard | ResolvedProblem;

// Null if the refId no longer resolves (content removed since saved); callers skip nulls.
export function resolveContent(kind: BookmarkKind, refId: string): ResolvedContent | null {
  if (kind === 'note') {
    const entry = noteById.get(refId);
    return entry ? { kind, refId, note: entry.note, url: entry.url } : null;
  }
  if (kind === 'flashcard') {
    const indexed = flashcardByKey.get(refId);
    return indexed ? { kind, refId, card: indexed.card, url: getFlashcardUrl(refId) } : null;
  }
  // problem — refId is the problem slug
  const hit = problemBySlug.get(refId);
  return hit ? { kind, refId, problem: hit.problem, url: hit.url } : null;
}
