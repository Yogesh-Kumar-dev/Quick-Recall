// project imports
import { createReducerManager } from './reducerManager';
import snackbarReducer from './slices/snackbar';
import timerReducer from './slices/timer';

// ==============================|| ROOT REDUCER (STATIC) + MANAGER ||============================== //

// Only globally-needed slices are wired statically. Feature slices (javascript,
// react, redux, nextjs, htmlcss, engineering) are injected on demand via the
// reducer manager so their reducer + data ship in the consuming route's chunk
// rather than the root bundle. See store/useInjectReducer.ts.
//
// `timer` is global like `snackbar` — the running timer lives in the always-mounted
// header and must survive navigation — so it's registered statically rather than
// injected per-page.
const staticReducers = {
  snackbar: snackbarReducer,
  timer: timerReducer
};

export const reducerManager = createReducerManager(staticReducers);

const reducer = reducerManager.reduce;

export default reducer;
