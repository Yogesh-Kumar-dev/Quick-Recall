import { createSlice } from '@reduxjs/toolkit';

import type { Note } from 'types/content';
import { nextjsNotes } from 'data/nextjs/nextjs-notes';
import { nextjsRenderingNotes } from 'data/nextjs/nextjs-rendering';

// ==============================|| SLICE - NEXT.JS ||============================== //

interface NextjsState {
  nextjsNotes: Note[];
  nextjsRenderingNotes: Note[];
}

const initialState: NextjsState = {
  nextjsNotes: nextjsNotes,
  nextjsRenderingNotes: nextjsRenderingNotes
};

const nextjsSlice = createSlice({
  name: 'nextjs',
  initialState,
  reducers: {}
});

export default nextjsSlice.reducer;

// ─── Selectors ───────────────────────────────────────────────────────────────

type State = { nextjs: NextjsState };

export const selectNextjsNotes = (state: State) => state.nextjs.nextjsNotes;
export const selectNextjsRenderingNotes = (state: State) => state.nextjs.nextjsRenderingNotes;
