import { createSlice } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { nextjsNotes } from 'data/nextjs/nextjs-notes';
import { nextjsRenderingNotes } from 'data/nextjs/nextjs-rendering';
import { nextjsFlashcards, nextjsRenderingFlashcards } from 'data/nextjs/nextjs-flashcards';

// ==============================|| SLICE - NEXT.JS ||============================== //

interface NextjsState {
  nextjsNotes: Note[];
  nextjsRenderingNotes: Note[];
  nextjsFlashcards: Flashcard[];
  nextjsRenderingFlashcards: Flashcard[];
}

const initialState: NextjsState = {
  nextjsNotes: nextjsNotes,
  nextjsRenderingNotes: nextjsRenderingNotes,
  nextjsFlashcards,
  nextjsRenderingFlashcards
};

const nextjsSlice = createSlice({
  name: 'nextjs',
  initialState,
  reducers: {}
});

export default nextjsSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { nextjs: NextjsState };

export const selectNextjsNotes = (state: State) => state.nextjs.nextjsNotes;
export const selectNextjsRenderingNotes = (state: State) => state.nextjs.nextjsRenderingNotes;
export const selectNextjsFlashcards = (state: State) => state.nextjs.nextjsFlashcards;
export const selectNextjsRenderingFlashcards = (state: State) => state.nextjs.nextjsRenderingFlashcards;
