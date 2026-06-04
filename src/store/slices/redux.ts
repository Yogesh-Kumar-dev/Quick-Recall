import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import {
  reduxNotes,
  reduxToolkitNotes,
  rtkQueryNotes,
  asyncThunkNotes,
  reduxFlashcards,
  reduxToolkitFlashcards,
  rtkQueryFlashcards,
  asyncThunkFlashcards
} from 'data/redux';

// ==============================|| SLICE - REDUX ||============================== //

interface ReduxState {
  reduxNotes: Note[];
  reduxToolkitNotes: Note[];
  rtkQueryNotes: Note[];
  asyncThunkNotes: Note[];
  reduxFlashcards: Flashcard[];
  reduxToolkitFlashcards: Flashcard[];
  rtkQueryFlashcards: Flashcard[];
  asyncThunkFlashcards: Flashcard[];
}

const initialState: ReduxState = {
  reduxNotes: reduxNotes,
  reduxToolkitNotes: reduxToolkitNotes,
  rtkQueryNotes: rtkQueryNotes,
  asyncThunkNotes: asyncThunkNotes,
  reduxFlashcards,
  reduxToolkitFlashcards,
  rtkQueryFlashcards,
  asyncThunkFlashcards
};

const reduxSlice = createSlice({
  name: 'redux',
  initialState,
  reducers: {}
});

export default reduxSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { redux: ReduxState };

const selectReduxState = (state: State) => state.redux;

export const selectReduxNotes = createSelector(selectReduxState, (s) => s.reduxNotes);
export const selectReduxToolkitNotes = createSelector(selectReduxState, (s) => s.reduxToolkitNotes);
export const selectRtkQueryNotes = createSelector(selectReduxState, (s) => s.rtkQueryNotes);
export const selectAsyncThunkNotes = createSelector(selectReduxState, (s) => s.asyncThunkNotes);
export const selectReduxFlashcards = createSelector(selectReduxState, (s) => s.reduxFlashcards);
export const selectReduxToolkitFlashcards = createSelector(selectReduxState, (s) => s.reduxToolkitFlashcards);
export const selectRtkQueryFlashcards = createSelector(selectReduxState, (s) => s.rtkQueryFlashcards);
export const selectAsyncThunkFlashcards = createSelector(selectReduxState, (s) => s.asyncThunkFlashcards);
