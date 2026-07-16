// project imports
import { db } from './index';

// types
import type { PracticeAttempt } from '@/types/study';

// Only module that touches persistence for machine-coding practice attempts.

export async function logAttempt(attempt: PracticeAttempt): Promise<void> {
  await db.attempts.add(attempt);
}

// Attempts started at/after `sinceMs`, newest first — feeds the dashboard streak/week widgets.
export async function recentAttempts(sinceMs: number): Promise<PracticeAttempt[]> {
  const rows = await db.attempts.where('startedAt').aboveOrEqual(sinceMs).sortBy('startedAt');
  return rows.reverse();
}

export async function attemptsForProblem(refId: string): Promise<PracticeAttempt[]> {
  const rows = await db.attempts.where('refId').equals(refId).sortBy('startedAt');
  return rows.reverse();
}
