// project imports
import { db } from './index';
import { makeId } from '@/lib/id';

// types
import type { QuizAttempt } from '@/types/study';

// ==============================|| QUIZ - REPOSITORY ||============================== //

// Only module that touches persistence for quiz attempts.

export async function getAll(): Promise<QuizAttempt[]> {
  return db.quizAttempts.orderBy('completedAt').reverse().toArray();
}

export async function create(input: Omit<QuizAttempt, 'id' | 'completedAt'>): Promise<QuizAttempt> {
  const attempt: QuizAttempt = { ...input, id: makeId(), completedAt: Date.now() };
  await db.quizAttempts.add(attempt);
  return attempt;
}
