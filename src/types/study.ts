// ==============================|| STUDY — BOOKMARKS + SRS TYPES ||============================== //

// Shared by Bookmarks and Spaced-Repetition Review; both are Dexie-backed and keyed by a
// stable, namespaced `refId` so the same content item resolves the same way everywhere.

// SRS covers flashcards and machine-coding problems; notes are bookmark-only.
export type BookmarkKind = 'note' | 'flashcard' | 'problem';

export interface Bookmark {
  id: string; // `${kind}:${refId}` — idempotent composite, so toggling is trivial
  kind: BookmarkKind;
  refId: string; // note.id | namespaced flashcard key `${source}:${cardId}` | problem slug
  createdAt: number;
}

// The four Anki-style recall ratings the user picks after revealing a card.
export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

// One enrolled item's scheduling state. "Due" when `dueAt <= now`. Intervals are tracked
// in MINUTES (not days) so the same-session learning steps (1m, 10m, …) are representable.
export interface ReviewState {
  id: string; // `${kind}:${refId}` — same composite scheme as Bookmark
  refId: string; // namespaced flashcard key `${source}:${cardId}` | problem slug
  easiness: number; // ease factor, default 2.5, floored at 1.3 — grows the gap on repeated success
  intervalMinutes: number; // minutes until next due
  repetitions: number; // consecutive successful recalls
  dueAt: number; // epoch ms
  lastReviewedAt: number; // epoch ms (0 before first review)
}

// An in-flight practice session, snapshotted every few seconds so navigating away
// mid-attempt is resumable — the wall clock keeps running against `startedAt`.
// One per problem (refId is the primary key); deleted once the attempt is graded.
export interface PracticeSessionState {
  refId: string; // problem slug
  kind: 'js' | 'react';
  startedAt: number; // epoch ms — elapsed/remaining time derives from this
  durationMin: number;
  code: string;
  updatedAt: number;
}

// One timed machine-coding practice session, logged when the user self-grades.
// Powers the dashboard streak/activity widgets; `code` keeps what was written for later self-diff.
export interface PracticeAttempt {
  id: string; // random uuid
  refId: string; // problem slug
  kind: 'js' | 'react';
  startedAt: number; // epoch ms
  durationSec: number;
  quality: ReviewQuality;
  gaveUp: boolean; // revealed the solution without submitting
  code: string;
}
