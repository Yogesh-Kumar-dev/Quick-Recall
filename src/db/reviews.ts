// project imports
import { db } from './index';
import { initialReviewState } from '@/lib/review-scheduler';

// types
import type { ReviewState } from '@/types/study';

// Only module that touches persistence for SRS review state. SRS covers flashcards only in
// v1, so `refId` is always a namespaced flashcard key (`${source}:${id}`).

function reviewId(refId: string): string {
  return `flashcard:${refId}`;
}

export async function getDue(now: number): Promise<ReviewState[]> {
  return db.reviews.where('dueAt').belowOrEqual(now).sortBy('dueAt');
}

// Count only (no row materialization) for the sidebar badge — cheaper than getDue.
export async function countDue(now: number): Promise<number> {
  return db.reviews.where('dueAt').belowOrEqual(now).count();
}

// Idempotent: leaves an already-enrolled card's schedule untouched so re-bookmarking doesn't reset progress.
export async function enroll(refId: string, now: number = Date.now()): Promise<void> {
  const id = reviewId(refId);
  const existing = await db.reviews.get(id);
  if (existing) return;
  await db.reviews.add(initialReviewState(refId, now));
}

export async function get(refId: string): Promise<ReviewState | undefined> {
  return db.reviews.get(reviewId(refId));
}

export async function upsertAfterReview(state: ReviewState): Promise<void> {
  await db.reviews.put(state);
}

export async function count(): Promise<number> {
  return db.reviews.count();
}

export async function remove(refId: string): Promise<void> {
  await db.reviews.delete(reviewId(refId));
}
