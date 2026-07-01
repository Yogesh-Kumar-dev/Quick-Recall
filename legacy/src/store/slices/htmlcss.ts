import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { htmlNotes, cssNotes, htmlFlashcards, cssFlashcards } from 'data/htmlcss';

// ==============================|| SLICE - HTML & CSS ||============================== //

export interface HtmlCssState {
  htmlNotes: Note[];
  cssNotes: Note[];
  htmlFlashcards: Flashcard[];
  cssFlashcards: Flashcard[];
}

const initialState: HtmlCssState = {
  htmlNotes,
  cssNotes,
  htmlFlashcards,
  cssFlashcards
};

const htmlcssSlice = createSlice({
  name: 'htmlcss',
  initialState,
  reducers: {}
});

export default htmlcssSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { htmlcss?: HtmlCssState };

// Falls back to initialState until the slice has been populated by a dispatch.
// Reducer injection (useInjectReducer) registers the reducer but does NOT
// dispatch, so state.htmlcss is undefined for the first render after a route
// loads — this keeps selectors safe without a render-phase dispatch.
const selectHtmlCssState = (state: State) => state.htmlcss ?? initialState;

export const selectHtmlNotes = createSelector(selectHtmlCssState, (s) => s.htmlNotes);
export const selectCssNotes = createSelector(selectHtmlCssState, (s) => s.cssNotes);
export const selectHtmlFlashcards = createSelector(selectHtmlCssState, (s) => s.htmlFlashcards);
export const selectCssFlashcards = createSelector(selectHtmlCssState, (s) => s.cssFlashcards);
