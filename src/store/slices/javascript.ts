import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, JsProblemEntry, QuickRecallSection, Flashcard } from 'types/content';
import { jsNotes, tsNotes, tsReactNotes, jsQuickRecall, tsQuickRecall, jsProblems, jsFlashcards, tsFlashcards } from 'data/javascript';

// ==============================|| SLICE - JAVASCRIPT & TYPESCRIPT ||============================== //

export interface JavaScriptState {
  jsNotes: Note[];
  tsNotes: Note[];
  tsReactNotes: Note[];
  jsQuickRecall: QuickRecallSection[];
  tsQuickRecall: QuickRecallSection[];
  jsProblems: JsProblemEntry[];
  jsFlashcards: Flashcard[];
  tsFlashcards: Flashcard[];
}

const initialState: JavaScriptState = {
  jsNotes,
  tsNotes,
  tsReactNotes,
  jsQuickRecall,
  tsQuickRecall,
  jsProblems,
  jsFlashcards,
  tsFlashcards
};

const javascriptSlice = createSlice({
  name: 'javascript',
  initialState,
  reducers: {}
});

export default javascriptSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { javascript?: JavaScriptState };

// Falls back to initialState until a dispatch populates the injected slice.
// See useInjectReducer — injection registers the reducer but doesn't dispatch.
const selectJavascriptState = (state: State) => state.javascript ?? initialState;

export const selectJsNotes = createSelector(selectJavascriptState, (s) => s.jsNotes);
export const selectTsNotes = createSelector(selectJavascriptState, (s) => s.tsNotes);
export const selectTsReactNotes = createSelector(selectJavascriptState, (s) => s.tsReactNotes);
export const selectJsQuickRecall = createSelector(selectJavascriptState, (s) => s.jsQuickRecall);
export const selectTsQuickRecall = createSelector(selectJavascriptState, (s) => s.tsQuickRecall);
export const selectJsProblems = createSelector(selectJavascriptState, (s) => s.jsProblems);
export const selectJsFlashcards = createSelector(selectJavascriptState, (s) => s.jsFlashcards);
export const selectTsFlashcards = createSelector(selectJavascriptState, (s) => s.tsFlashcards);
