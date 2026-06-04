import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { nextjsNotes, nextjsRenderingNotes, nextjsFlashcards, nextjsRenderingFlashcards } from 'data/nextjs';

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

const selectNextjsState = (state: State) => state.nextjs;

export const selectNextjsNotes = createSelector(selectNextjsState, (s) => s.nextjsNotes);
export const selectNextjsRenderingNotes = createSelector(selectNextjsState, (s) => s.nextjsRenderingNotes);
export const selectNextjsFlashcards = createSelector(selectNextjsState, (s) => s.nextjsFlashcards);
export const selectNextjsRenderingFlashcards = createSelector(selectNextjsState, (s) => s.nextjsRenderingFlashcards);
