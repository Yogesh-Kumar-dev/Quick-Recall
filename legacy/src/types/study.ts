// ==============================|| STUDY — BOOKMARKS + SRS TYPES ||============================== //

// Shared by the Bookmarks ("mark for review") and Spaced-Repetition Review features.
// Both are Dexie-backed (see src/db/index.ts version 3) and keyed by a stable,
// namespaced `refId` so the same content item resolves the same way everywhere.

// What kind of content a bookmark points at. SRS in v1 covers flashcards only,
// but anything below can be bookmarked.
export type BookmarkKind = 'note' | 'flashcard' | 'problem';

export interface Bookmark {
  id: string; // `${kind}:${refId}` — idempotent composite, so toggling is trivial
  kind: BookmarkKind;
  refId: string; // note.id | namespaced flashcard key `${source}:${cardId}` | problem slug
  createdAt: number;
}

// The four Anki-style recall ratings the user picks after revealing a card.
export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

// One enrolled flashcard's scheduling state. "Due" when `dueAt <= now`. Intervals are tracked
// in MINUTES (not days) so the short, same-session learning steps used for interview-timeframe
// prep (1m, 10m, …) are representable alongside multi-day gaps.
export interface ReviewState {
  id: string; // `flashcard:${refId}` — same composite scheme as Bookmark
  refId: string; // namespaced flashcard key `${source}:${cardId}`
  easiness: number; // ease factor, default 2.5, floored at 1.3 — grows the gap on repeated success
  intervalMinutes: number; // minutes until next due
  repetitions: number; // consecutive successful recalls
  dueAt: number; // epoch ms
  lastReviewedAt: number; // epoch ms (0 before first review)
}
