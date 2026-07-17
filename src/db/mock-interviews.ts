// project imports
import { db } from './index';
import { makeId } from '@/lib/id';

// types
import type { MockInterview, MockInterviewInput, ReflectionSource } from '@/types/mock-interview';

// Only module that touches persistence for mock interviews.

export async function getAll(): Promise<MockInterview[]> {
  return db.mockInterviews.orderBy('startedAt').reverse().toArray();
}

export async function get(id: string): Promise<MockInterview | undefined> {
  return db.mockInterviews.get(id);
}

export async function create(input: MockInterviewInput, questions: MockInterview['questions']): Promise<MockInterview> {
  const interview: MockInterview = {
    id: makeId(),
    topics: input.topics,
    includeKinds: input.includeKinds,
    persona: input.persona,
    questions,
    status: 'in-progress',
    currentIndex: 0,
    startedAt: Date.now()
  };
  await db.mockInterviews.add(interview);
  return interview;
}

// Moves to the next question during the live run, optionally recording the speech-captured
// transcript as that question's initial reflection, and marking the interview complete on the
// last question — all in a single read-modify-write (the live "Next" click only ever needs one).
export async function advanceQuestion(id: string, index: number, transcript: string | null, isLast: boolean): Promise<void> {
  const interview = await db.mockInterviews.get(id);
  if (!interview) return;
  const questions = transcript
    ? interview.questions.map((q, i) =>
        i === index ? { ...q, reflection: transcript, reflectionSource: 'speech' as const, answeredAt: Date.now() } : q
      )
    : interview.questions;
  await db.mockInterviews.update(id, {
    questions,
    currentIndex: Math.max(interview.currentIndex, index + 1),
    ...(isLast ? { status: 'completed' as const, completedAt: Date.now() } : {})
  });
}

// Self-reflection edited after the interview completes, reviewing the whole transcript at once.
// `source` distinguishes an unedited speech capture from a deliberate recap edit, for the UI to flag.
export async function saveReflection(id: string, index: number, reflection: string, source: ReflectionSource): Promise<void> {
  const interview = await db.mockInterviews.get(id);
  if (!interview) return;
  const questions = interview.questions.map((q, i) =>
    i === index ? { ...q, reflection, reflectionSource: source, answeredAt: Date.now() } : q
  );
  await db.mockInterviews.update(id, { questions });
}

export async function remove(id: string): Promise<void> {
  await db.mockInterviews.delete(id);
}
