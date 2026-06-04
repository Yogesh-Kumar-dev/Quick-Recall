import { createSlice } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { reduxNotes, reduxToolkitNotes, rtkQueryNotes, asyncThunkNotes, reduxFlashcards, reduxToolkitFlashcards, rtkQueryFlashcards, asyncThunkFlashcards } from 'data/redux';

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

export const selectReduxNotes = (state: State) => state.redux.reduxNotes;
export const selectReduxToolkitNotes = (state: State) => state.redux.reduxToolkitNotes;
export const selectRtkQueryNotes = (state: State) => state.redux.rtkQueryNotes;
export const selectAsyncThunkNotes = (state: State) => state.redux.asyncThunkNotes;
export const selectReduxFlashcards = (state: State) => state.redux.reduxFlashcards;
export const selectReduxToolkitFlashcards = (state: State) => state.redux.reduxToolkitFlashcards;
export const selectRtkQueryFlashcards = (state: State) => state.redux.rtkQueryFlashcards;
export const selectAsyncThunkFlashcards = (state: State) => state.redux.asyncThunkFlashcards;
