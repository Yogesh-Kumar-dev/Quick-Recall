import type { QuizQuestion } from '@/types/content';
import type { QuizSource } from './quiz-index';
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

export interface QuizSet {
  questions: QuizQuestion[];
  source: QuizSource; // builds each question's namespaced refId (`${source}:${id}`) for mock interview
  title: string;
}

// Single source of truth for the quiz sets: consumed by both the `/quiz` index
// (lists every set) and `/quiz/[section]` (renders one). Keyed by URL slug.
export const QUIZ_SETS: Record<string, QuizSet> = {
  js: { questions: jsQuiz, source: 'js', title: 'JavaScript Quiz' },
  typescript: { questions: tsQuiz, source: 'ts', title: 'TypeScript Quiz' },
  react: { questions: reactQuiz, source: 'react', title: 'React Quiz' },
  nextjs: { questions: nextjsQuiz, source: 'nextjs', title: 'Next.js Quiz' },
  redux: { questions: reduxQuiz, source: 'redux', title: 'Redux Quiz' },
  htmlcss: { questions: htmlcssQuiz, source: 'htmlcss', title: 'HTML & CSS Quiz' },
  nodejs: { questions: nodejsQuiz, source: 'nodejs', title: 'Node.js Quiz' },
  engineering: { questions: engineeringQuiz, source: 'engineering', title: 'Engineering Essentials Quiz' },
  databases: { questions: databasesQuiz, source: 'databases', title: 'Databases Quiz' },
  testing: { questions: testingQuiz, source: 'testing', title: 'Testing Quiz' },
  web: { questions: webQuiz, source: 'web', title: 'Web Platform Quiz' }
};
