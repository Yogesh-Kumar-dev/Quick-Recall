// project imports
import { db } from './index';
import { initialReviewState } from '@/lib/review-scheduler';

// types
import type { BookmarkKind, ReviewState } from '@/types/study';

// Only module that touches persistence for SRS review state. Covers flashcards
// (refId = `${source}:${id}`) and machine-coding problems (refId = slug).

function reviewId(refId: string, kind: BookmarkKind = 'flashcard'): string {
  return `${kind}:${refId}`;
}

export async function getDue(now: number): Promise<ReviewState[]> {
  return db.reviews.where('dueAt').belowOrEqual(now).sortBy('dueAt');
}

// Count only (no row materialization) for the sidebar badge — cheaper than getDue.
export async function countDue(now: number): Promise<number> {
  return db.reviews.where('dueAt').belowOrEqual(now).count();
}

// Idempotent: leaves an already-enrolled item's schedule untouched so re-enrolling doesn't reset progress.
export async function enroll(refId: string, now: number = Date.now(), kind: BookmarkKind = 'flashcard'): Promise<void> {
  const id = reviewId(refId, kind);
  const existing = await db.reviews.get(id);
  if (existing) return;
  await db.reviews.add(initialReviewState(refId, now, kind));
}

export async function get(refId: string, kind: BookmarkKind = 'flashcard'): Promise<ReviewState | undefined> {
  return db.reviews.get(reviewId(refId, kind));
}

export async function upsertAfterReview(state: ReviewState): Promise<void> {
  await db.reviews.put(state);
}

export async function count(): Promise<number> {
  return db.reviews.count();
}

export async function remove(refId: string, kind: BookmarkKind = 'flashcard'): Promise<void> {
  await db.reviews.delete(reviewId(refId, kind));
}
