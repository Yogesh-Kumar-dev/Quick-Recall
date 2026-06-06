import { createSlice, createSelector } from '@reduxjs/toolkit';

import type { Note, Flashcard } from 'types/content';
import { engineeringNotes, engineeringFlashcards } from 'data/engineering';

// ==============================|| SLICE - ENGINEERING ESSENTIALS ||============================== //

export interface EngineeringState {
  engineeringNotes: Note[];
  engineeringFlashcards: Flashcard[];
}

const initialState: EngineeringState = {
  engineeringNotes,
  engineeringFlashcards
};

const engineeringSlice = createSlice({
  name: 'engineering',
  initialState,
  reducers: {}
});

export default engineeringSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { engineering?: EngineeringState };

// Falls back to initialState until a dispatch populates the injected slice.
// See useInjectReducer — injection registers the reducer but doesn't dispatch.
const selectEngineeringState = (state: State) => state.engineering ?? initialState;

export const selectEngineeringNotes = createSelector(selectEngineeringState, (s) => s.engineeringNotes);
export const selectEngineeringFlashcards = createSelector(selectEngineeringState, (s) => s.engineeringFlashcards);
