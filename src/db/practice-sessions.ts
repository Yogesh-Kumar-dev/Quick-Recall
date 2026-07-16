// project imports
import { db } from './index';

// types
import type { PracticeSessionState } from '@/types/study';

// Only module that touches persistence for in-flight practice sessions. A session row is
// the resume point for an attempt-in-progress; grading (or discarding) deletes it.

export async function save(session: Omit<PracticeSessionState, 'updatedAt'>): Promise<void> {
  await db.practiceSessions.put({ ...session, updatedAt: Date.now() });
}

export async function get(refId: string): Promise<PracticeSessionState | undefined> {
  return db.practiceSessions.get(refId);
}

export async function remove(refId: string): Promise<void> {
  await db.practiceSessions.delete(refId);
}
