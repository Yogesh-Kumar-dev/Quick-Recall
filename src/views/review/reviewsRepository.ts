// project imports
import { db } from 'db';
import { initialReviewState } from './scheduler';

// types
import type { ReviewState } from 'types/study';

// The ONLY module that touches persistence for SRS review state. Async-shaped like the other
// repositories so the storage layer can be swapped without touching the hook/UI. SRS covers
// flashcards only in v1, so `refId` is always a namespaced flashcard key (`${source}:${id}`).

function reviewId(refId: string): string {
  return `flashcard:${refId}`;
}

// All cards due now-or-earlier, oldest-due first (so the most overdue surfaces first).
export async function getDue(now: number): Promise<ReviewState[]> {
  return db.reviews.where('dueAt').belowOrEqual(now).sortBy('dueAt');
}

// Count of cards due now-or-earlier — for the sidebar badge and the due reminder. Cheaper than
// getDue (no row materialization); uses the `dueAt` index.
export async function countDue(now: number): Promise<number> {
  return db.reviews.where('dueAt').belowOrEqual(now).count();
}

// Enroll a flashcard into the scheduler. Idempotent: if already enrolled, leaves its existing
// schedule untouched (so re-bookmarking doesn't reset progress). New cards are due immediately.
export async function enroll(refId: string, now: number = Date.now()): Promise<void> {
  const id = reviewId(refId);
  const existing = await db.reviews.get(id);
  if (existing) return;
  await db.reviews.add(initialReviewState(refId, now));
}

export async function get(refId: string): Promise<ReviewState | undefined> {
  return db.reviews.get(reviewId(refId));
}

// Persist the post-review scheduling state computed by the pure scheduler.
export async function upsertAfterReview(state: ReviewState): Promise<void> {
  await db.reviews.put(state);
}

export async function count(): Promise<number> {
  return db.reviews.count();
}

export async function remove(refId: string): Promise<void> {
  await db.reviews.delete(reviewId(refId));
}
