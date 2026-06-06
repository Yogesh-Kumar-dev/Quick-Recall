import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, ReactMcProblem, QuickRecallSection, Flashcard } from 'types/content';
import { reactNotes, reactQuickRecall, reactMcProblems, reactFlashcards } from 'data/react';

// ==============================|| SLICE - REACT ||============================== //

export interface ReactState {
  reactNotes: Note[];
  reactQuickRecall: QuickRecallSection[];
  reactMcProblems: ReactMcProblem[];
  reactFlashcards: Flashcard[];
}

const initialState: ReactState = {
  reactNotes: reactNotes,
  reactQuickRecall,
  reactMcProblems,
  reactFlashcards
};

const reactSlice = createSlice({
  name: 'react',
  initialState,
  reducers: {}
});

export default reactSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { react?: ReactState };

// Falls back to initialState until a dispatch populates the injected slice.
// See useInjectReducer — injection registers the reducer but doesn't dispatch.
const selectReactState = (state: State) => state.react ?? initialState;

export const selectReactNotes = createSelector(selectReactState, (s) => s.reactNotes);
export const selectReactQuickRecall = createSelector(selectReactState, (s) => s.reactQuickRecall);
export const selectReactMcProblems = createSelector(selectReactState, (s) => s.reactMcProblems);
export const selectReactFlashcards = createSelector(selectReactState, (s) => s.reactFlashcards);
