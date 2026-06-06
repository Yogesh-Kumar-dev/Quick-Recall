// project imports
import { createReducerManager } from './reducerManager';
import snackbarReducer from './slices/snackbar';

// ==============================|| ROOT REDUCER (STATIC) + MANAGER ||============================== //

// Only globally-needed slices are wired statically. Feature slices (javascript,
// react, redux, nextjs, htmlcss, engineering) are injected on demand via the
// reducer manager so their reducer + data ship in the consuming route's chunk
// rather than the root bundle. See store/useInjectReducer.ts.
const staticReducers = {
  snackbar: snackbarReducer
};

export const reducerManager = createReducerManager(staticReducers);

const reducer = reducerManager.reduce;

export default reducer;
