import { createSlice } from '@reduxjs/toolkit';

import type { Note, ReactMcProblem, QuickRecallSection } from 'types/content';
import { reactNotes } from 'data/react/react-notes';
import { reactQuickRecall } from 'data/react/react-quick-recall';
import { reactMcProblems } from 'data/react/react-mc-problems';

// ==============================|| SLICE - REACT ||============================== //

interface ReactState {
  reactNotes: Note[];
  reactQuickRecall: QuickRecallSection[];
  reactMcProblems: ReactMcProblem[];
}

const initialState: ReactState = {
  reactNotes: reactNotes,
  reactQuickRecall,
  reactMcProblems
};

const reactSlice = createSlice({
  name: 'react',
  initialState,
  reducers: {}
});

export default reactSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { react: ReactState };

export const selectReactNotes = (state: State) => state.react.reactNotes;
export const selectReactQuickRecall = (state: State) => state.react.reactQuickRecall;
export const selectReactMcProblems = (state: State) => state.react.reactMcProblems;
