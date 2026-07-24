// ==============================|| QUIZ — UNIFIED INDEX ||============================== //

// Quiz questions live in per-topic files, each with ids unique only within their own file, so
// we namespace each question with its source → a globally-stable `key` (`${source}:${id}`).
// This is the single source of truth for "every quiz question in the app", reused by
// resolveContent() when a quiz question is asked inside a Mock Interview. Mirrors flashcards-index.ts.

import type { QuizQuestion } from '@/types/content';

import { jsQuiz } from './javascript/js-quiz';
import { tsQuiz } from './javascript/ts-quiz';
import { reactQuiz } from './react/react-quiz';
import { nextjsQuiz } from './nextjs/nextjs-quiz';
import { reduxQuiz } from './redux/redux-quiz';
import { htmlcssQuiz } from './htmlcss/htmlcss-quiz';
import { nodejsQuiz } from './nodejs/nodejs-quiz';
import { engineeringQuiz } from './engineering/engineering-quiz';
import { databasesQuiz } from './databases/databases-quiz';
import { testingQuiz } from './testing/testing-quiz';
import { webQuiz } from './web/web-quiz';

// A short, stable namespace per source. Used as the `key` prefix — changing one of these
// strings would orphan existing mock interview questions that reference it, so treat as permanent.
export type QuizSource = 'js' | 'ts' | 'react' | 'nextjs' | 'redux' | 'htmlcss' | 'nodejs' | 'engineering' | 'databases' | 'testing' | 'web';

export interface IndexedQuizQuestion {
  key: string; // `${source}:${question.id}` — the refId used by Mock Interview
  source: QuizSource;
  question: QuizQuestion;
}

const SOURCES: { source: QuizSource; questions: QuizQuestion[] }[] = [
  { source: 'js', questions: jsQuiz },
  { source: 'ts', questions: tsQuiz },
  { source: 'react', questions: reactQuiz },
  { source: 'nextjs', questions: nextjsQuiz },
  { source: 'redux', questions: reduxQuiz },
  { source: 'htmlcss', questions: htmlcssQuiz },
  { source: 'nodejs', questions: nodejsQuiz },
  { source: 'engineering', questions: engineeringQuiz },
  { source: 'databases', questions: databasesQuiz },
  { source: 'testing', questions: testingQuiz },
  { source: 'web', questions: webQuiz }
];

export function quizKey(source: QuizSource, questionId: string): string {
  return `${source}:${questionId}`;
}

const allQuizQuestions: IndexedQuizQuestion[] = SOURCES.flatMap(({ source, questions }) =>
  questions.map((question) => ({ key: quizKey(source, question.id), source, question }))
);

// O(1) `refId → indexed question` lookup for the resolver and mock interview pool.
export const quizByKey: Map<string, IndexedQuizQuestion> = new Map(allQuizQuestions.map((q) => [q.key, q]));
