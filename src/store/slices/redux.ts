import { createSlice } from '@reduxjs/toolkit';

import type { Note } from 'types/content';
import { reduxNotes } from 'data/redux/redux-notes';
import { reduxToolkitNotes } from 'data/redux/redux-toolkit-notes';
import { rtkQueryNotes } from 'data/redux/rtk-query-notes';
import { asyncThunkNotes } from 'data/redux/async-thunk-notes';

// ==============================|| SLICE - REDUX ||============================== //

interface ReduxState {
  reduxNotes: Note[];
  reduxToolkitNotes: Note[];
  rtkQueryNotes: Note[];
  asyncThunkNotes: Note[];
}

const initialState: ReduxState = {
  reduxNotes: reduxNotes,
  reduxToolkitNotes: reduxToolkitNotes,
  rtkQueryNotes: rtkQueryNotes,
  asyncThunkNotes: asyncThunkNotes
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
