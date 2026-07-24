// ==============================|| MOCK INTERVIEW TYPES ||============================== //

// A mock interview is a fixed, self-generated set of questions (notes/flashcards/problems,
// referenced the same way Bookmarks/Review do) worked through sequentially and self-reflected
// on afterward — no scoring/evaluation, just practice + a record of what was asked.

import type { ResolvableKind } from '@/lib/resolve-content';

export type MockInterviewQuestionKind = ResolvableKind;

export type ReflectionSource = 'speech' | 'manual';

export interface MockInterviewQuestion {
  kind: MockInterviewQuestionKind;
  refId: string; // note.id | `${FlashcardSource}:${cardId}` | problem slug | `${QuizSource}:${questionId}` — same convention as Bookmark.refId
  reflection: string; // free-text self-note; '' until answered — unused for kind 'quiz'
  reflectionSource?: ReflectionSource; // 'speech' until the recap edit is saved, then 'manual' — lets the UI flag unedited transcripts
  answeredAt?: number; // epoch ms, set when the reflection is saved
  selectedOptionIndex?: number; // set only for kind 'quiz' — index into the question's options once answered
}

export interface MockInterviewPersona {
  name: string;
  title: string; // e.g. "Senior Frontend Engineer" or "Acme Corp — Senior Frontend Engineer"
  jobId?: string; // JobApplication.id, set when the persona was sourced from Job Tracker
}

export type MockInterviewStatus = 'in-progress' | 'completed';

export interface MockInterview {
  id: string;
  topics: string[]; // topic labels selected in the survey (MockInterviewTopic.label)
  includeKinds: MockInterviewQuestionKind[];
  persona: MockInterviewPersona;
  questions: MockInterviewQuestion[]; // fixed order, generated once at creation
  status: MockInterviewStatus;
  currentIndex: number; // resume point for the sequential runner
  startedAt: number;
  completedAt?: number;
}

export type MockInterviewInput = Pick<MockInterview, 'topics' | 'includeKinds' | 'persona'> & { questionCount: number };
