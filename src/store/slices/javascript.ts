import { createSlice } from '@reduxjs/toolkit';

import type { Note, JsProblemEntry, QuickRecallSection } from 'types/content';
import { jsNotes } from 'data/javascript/js-notes';
import { tsNotes } from 'data/javascript/ts-notes';
import { jsQuickRecall, tsQuickRecall } from 'data/javascript/js-quick-recall';
import { jsProblems } from 'data/javascript/js-problems';

// ==============================|| SLICE - JAVASCRIPT & TYPESCRIPT ||============================== //

interface JavaScriptState {
  jsNotes: Note[];
  tsNotes: Note[];
  jsQuickRecall: QuickRecallSection[];
  tsQuickRecall: QuickRecallSection[];
  jsProblems: JsProblemEntry[];
}

const initialState: JavaScriptState = {
  jsNotes: jsNotes,
  tsNotes: tsNotes,
  jsQuickRecall,
  tsQuickRecall,
  jsProblems
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
export const selectJsQuickRecall = (state: State) => state.javascript.jsQuickRecall;
export const selectTsQuickRecall = (state: State) => state.javascript.tsQuickRecall;
export const selectJsProblems = (state: State) => state.javascript.jsProblems;
