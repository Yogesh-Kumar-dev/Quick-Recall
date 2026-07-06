// ==============================|| FLASHCARDS — UNIFIED INDEX ||============================== //

// Flashcards live in 12 exports across 7 files (js/ts/react/nextjs/redux/htmlcss/engineering).
// Per-card `id`s are only unique within their own file, so we namespace each card with its
// source → a globally-stable `key` (`${source}:${id}`). This is the SINGLE source of truth
// for "every flashcard in the app", reused by both Bookmarks (render a saved flashcard) and
// SRS Review (resolve a due card's content). Mirrors the structure of `search-index.ts`.

import type { Flashcard } from '@/types/content';

import { jsFlashcards, tsFlashcards } from './javascript/js-flashcards';
import { reactFlashcards } from './react/react-flashcards';
import { nextjsFlashcards, nextjsRenderingFlashcards } from './nextjs/nextjs-flashcards';
import { reduxFlashcards, reduxToolkitFlashcards, rtkQueryFlashcards, asyncThunkFlashcards } from './redux/redux-flashcards';
import { htmlFlashcards, cssFlashcards } from './htmlcss/htmlcss-flashcards';
import { engineeringFlashcards } from './engineering/engineering-flashcards';

// A short, stable namespace per source. Used as the `key` prefix — changing one of these
// strings would orphan existing bookmarks/reviews, so treat them as permanent identifiers.
export type FlashcardSource =
  | 'js'
  | 'ts'
  | 'react'
  | 'nextjs'
  | 'nextjsRendering'
  | 'redux'
  | 'reduxToolkit'
  | 'rtkQuery'
  | 'asyncThunk'
  | 'html'
  | 'css'
  | 'engineering';

export interface IndexedFlashcard {
  key: string; // `${source}:${card.id}` — the refId used by bookmarks + reviews
  source: FlashcardSource;
  card: Flashcard;
}

const SOURCES: { source: FlashcardSource; cards: Flashcard[] }[] = [
  { source: 'js', cards: jsFlashcards },
  { source: 'ts', cards: tsFlashcards },
  { source: 'react', cards: reactFlashcards },
  { source: 'nextjs', cards: nextjsFlashcards },
  { source: 'nextjsRendering', cards: nextjsRenderingFlashcards },
  { source: 'redux', cards: reduxFlashcards },
  { source: 'reduxToolkit', cards: reduxToolkitFlashcards },
  { source: 'rtkQuery', cards: rtkQueryFlashcards },
  { source: 'asyncThunk', cards: asyncThunkFlashcards },
  { source: 'html', cards: htmlFlashcards },
  { source: 'css', cards: cssFlashcards },
  { source: 'engineering', cards: engineeringFlashcards }
];

// Build the namespaced key for a card from a known source. Exported so callers that render a
// flashcard set (and already know the source) can hand each card's refId to BookmarkButton.
export function flashcardKey(source: FlashcardSource, cardId: string): string {
  return `${source}:${cardId}`;
}

const allFlashcards: IndexedFlashcard[] = SOURCES.flatMap(({ source, cards }) =>
  cards.map((card) => ({ key: flashcardKey(source, card.id), source, card }))
);

// O(1) `refId → indexed flashcard` lookup for the resolver and review session.
export const flashcardByKey: Map<string, IndexedFlashcard> = new Map(allFlashcards.map((f) => [f.key, f]));
