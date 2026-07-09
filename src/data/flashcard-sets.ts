import type { Flashcard } from '@/types/content';
import type { FlashcardSource } from './flashcards-index';
import { jsFlashcards, tsFlashcards } from './javascript/js-flashcards';
import { reactFlashcards } from './react/react-flashcards';
import { nextjsFlashcards, nextjsRenderingFlashcards } from './nextjs/nextjs-flashcards';
import { nodejsFlashcards } from './nodejs/nodejs-flashcards';
import { htmlFlashcards, cssFlashcards } from './htmlcss/htmlcss-flashcards';
import { engineeringFlashcards } from './engineering/engineering-flashcards';
import { reduxFlashcards, reduxToolkitFlashcards, rtkQueryFlashcards, asyncThunkFlashcards } from './redux/redux-flashcards';

export interface FlashcardSet {
  cards: Flashcard[];
  source: FlashcardSource; // builds each card's namespaced refId (`${source}:${id}`) for bookmarks + review
  title: string;
}

// Single source of truth for the flashcard sets: consumed by both the `/flashcards` index
// (lists every set) and `/flashcards/[section]` (renders one). Keyed by URL slug.
export const FLASHCARD_SETS: Record<string, FlashcardSet> = {
  js: { cards: jsFlashcards, source: 'js', title: 'JavaScript Flashcards' },
  typescript: { cards: tsFlashcards, source: 'ts', title: 'TypeScript Flashcards' },
  react: { cards: reactFlashcards, source: 'react', title: 'React Flashcards' },
  nextjs: { cards: nextjsFlashcards, source: 'nextjs', title: 'Next.js Flashcards' },
  'nextjs-rendering': { cards: nextjsRenderingFlashcards, source: 'nextjsRendering', title: 'Next.js Rendering Flashcards' },
  nodejs: { cards: nodejsFlashcards, source: 'nodejs', title: 'Node.js Flashcards' },
  html: { cards: htmlFlashcards, source: 'html', title: 'HTML Flashcards' },
  css: { cards: cssFlashcards, source: 'css', title: 'CSS Flashcards' },
  engineering: { cards: engineeringFlashcards, source: 'engineering', title: 'Engineering Essentials Flashcards' },
  redux: { cards: reduxFlashcards, source: 'redux', title: 'Redux Flashcards' },
  'redux-toolkit': { cards: reduxToolkitFlashcards, source: 'reduxToolkit', title: 'Redux Toolkit Flashcards' },
  'rtk-query': { cards: rtkQueryFlashcards, source: 'rtkQuery', title: 'RTK Query Flashcards' },
  'async-thunk': { cards: asyncThunkFlashcards, source: 'asyncThunk', title: 'createAsyncThunk Flashcards' }
};
