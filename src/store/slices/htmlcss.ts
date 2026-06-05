import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { htmlNotes, cssNotes, htmlFlashcards, cssFlashcards } from 'data/htmlcss';

// ==============================|| SLICE - HTML & CSS ||============================== //

interface HtmlCssState {
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

type State = { htmlcss: HtmlCssState };

const selectHtmlCssState = (state: State) => state.htmlcss;

export const selectHtmlNotes = createSelector(selectHtmlCssState, (s) => s.htmlNotes);
export const selectCssNotes = createSelector(selectHtmlCssState, (s) => s.cssNotes);
export const selectHtmlFlashcards = createSelector(selectHtmlCssState, (s) => s.htmlFlashcards);
export const selectCssFlashcards = createSelector(selectHtmlCssState, (s) => s.cssFlashcards);
