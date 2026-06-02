import { createSlice } from '@reduxjs/toolkit';

import type { Note, JsProblemEntry, QuickRecallSection, Flashcard } from 'types/content';
import { jsNotes } from 'data/javascript/js-notes';
import { tsNotes } from 'data/javascript/ts-notes';
import { tsReactNotes } from 'data/javascript/ts-react';
import { jsQuickRecall, tsQuickRecall } from 'data/javascript/js-quick-recall';
import { jsProblems } from 'data/javascript/js-problems';
import { jsFlashcards, tsFlashcards } from 'data/javascript/js-flashcards';

// ==============================|| SLICE - JAVASCRIPT & TYPESCRIPT ||============================== //

interface JavaScriptState {
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
  jsNotes: jsNotes,
  tsNotes: tsNotes,
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

type State = { javascript: JavaScriptState };

export const selectJsNotes = (state: State) => state.javascript.jsNotes;
export const selectTsNotes = (state: State) => state.javascript.tsNotes;
export const selectTsReactNotes = (state: State) => state.javascript.tsReactNotes;
export const selectJsQuickRecall = (state: State) => state.javascript.jsQuickRecall;
export const selectTsQuickRecall = (state: State) => state.javascript.tsQuickRecall;
export const selectJsProblems = (state: State) => state.javascript.jsProblems;
export const selectJsFlashcards = (state: State) => state.javascript.jsFlashcards;
export const selectTsFlashcards = (state: State) => state.javascript.tsFlashcards;
