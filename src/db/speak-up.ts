// project imports
import { db } from './index';

// types
import type { SpeakUpQA, SpeakUpQAInput } from '@/types/speak-up';

// ==============================|| SPEAK UP - REPOSITORY ||============================== //

// Only module that touches persistence for Speak Up Q&As; async-shaped so a future HTTP
// backend only needs the body of these functions changed.

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function getAll(): Promise<SpeakUpQA[]> {
  return db.speakUpQAs.orderBy('createdAt').reverse().toArray();
}

export async function create(input: SpeakUpQAInput): Promise<SpeakUpQA> {
  const now = Date.now();
  const qa: SpeakUpQA = { ...input, id: makeId(), createdAt: now, updatedAt: now };
  await db.speakUpQAs.add(qa);
  return qa;
}

export async function update(id: string, input: SpeakUpQAInput): Promise<SpeakUpQA> {
  const existing = await db.speakUpQAs.get(id);
  if (!existing) {
    throw new Error('Question not found');
  }
  const updated: SpeakUpQA = { ...existing, ...input, id, updatedAt: Date.now() };
  await db.speakUpQAs.put(updated);
  return updated;
}

export async function remove(id: string): Promise<void> {
  await db.speakUpQAs.delete(id);
}
