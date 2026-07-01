import { useState, useEffect } from 'react';
import type { Reducer } from 'redux';

import { store } from 'store';

// ==============================|| HOOK - INJECT REDUCER ||============================== //

/**
 * Injects a slice reducer into the store the first time a component renders, so
 * the slice's data is available to `useSelector(selectX)` in the same render.
 *
 * Two phases, split to stay render-safe:
 *
 * 1. **Register (during render, no dispatch).** In a `useState` initializer
 *    (runs once, before the selectors below it) we `reducerManager.add` the
 *    reducer. This does NOT dispatch — dispatching during render would notify
 *    store subscribers (e.g. the in-app DockMonitor) mid-render, which React
 *    forbids ("Cannot update a component while rendering a different
 *    component"). For this first render the slice branch is still `undefined`;
 *    the slice's root selector falls back to `initialState` (`s.<key> ??
 *    initialState`), so the UI is correct.
 *
 * 2. **Materialise in the store (after commit).** A `useEffect` dispatches a
 *    one-off `@@inject/<key>` so `combineReducers` runs the new reducer and the
 *    branch actually appears in `store.getState()`. Effects run AFTER commit, so
 *    notifying subscribers here is safe. Without this the branch would stay
 *    invisible in the store / Redux DevTools until some other action dispatched.
 *
 * `reducerManager.add` is idempotent and the effect's `added` check guards the
 * dispatch, so multiple consumers injecting the same key (and re-navigation) are
 * safe — the dispatch fires only on the genuine first injection.
 *
 * @example
 *   import javascriptReducer from 'store/slices/javascript';
 *   useInjectReducer('javascript', javascriptReducer);
 */
export default function useInjectReducer(key: string, reducer: Reducer): void {
  // Phase 1 — register during render (no dispatch). Once per component instance,
  // before the selectors below it. `added` tells the effect whether THIS call is
  // the first to register the key, so it only dispatches when there's something
  // new to materialise.
  const [added] = useState(() => {
    const isNew = !store.reducerManager.getReducerMap()[key];
    store.reducerManager.add(key, reducer);
    return isNew;
  });

  // Phase 2 — after commit, dispatch once so the branch shows up in the store.
  // Safe to notify subscribers here (effects run post-render). Guarded by
  // `added` so re-navigation to an already-injected slice doesn't re-dispatch.
  useEffect(() => {
    if (added) {
      store.dispatch({ type: `@@inject/${key}` });
    }
    // key/reducer are stable for a given mounted view; run this once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
