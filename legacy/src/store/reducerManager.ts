// third party
import { combineReducers, type Reducer, type Action, type UnknownAction } from 'redux';

// ==============================|| REDUX - DYNAMIC REDUCER MANAGER ||============================== //

/**
 * Owns the set of reducers currently wired into the store and lets feature code
 * inject / eject slices at runtime. This is what makes Redux code-splitting
 * possible: a lazily-loaded route can register its own slice (and ship its
 * reducer + data in that route's chunk) instead of every slice being statically
 * imported into the root bundle.
 *
 * Full data-flow + rationale (build chunk → heap → injected store state) lives
 * in docs/dynamic-reducer-injection.md.
 *
 * Usage:
 *   const manager = createReducerManager({ snackbar });
 *   configureStore({ reducer: manager.reduce });
 *   store.reducerManager = manager;          // expose for the inject hook
 *   manager.add('javascript', javascriptReducer); // later, from a feature
 */
export interface ReducerManager<S = Record<string, unknown>> {
  /**
   * The root reducer to hand to configureStore. Typed as the *static* state S —
   * dynamically injected branches are added at runtime and typed separately via
   * RootState (see store/index.ts), so consumers of static slices keep their
   * precise types here.
   */
  reduce: Reducer<S>;
  /** Inject a slice. No-op if the key is already present. */
  add: (key: string, reducer: Reducer) => void;
  /** Eject a slice and drop its state branch. No-op if absent. */
  remove: (key: string) => void;
  /** Keys currently registered. */
  getReducerMap: () => Record<string, Reducer>;
}

export function createReducerManager<S extends Record<string, unknown>>(
  initialReducers: {
    [K in keyof S]: Reducer<S[K]>;
  }
): ReducerManager<S> {
  // The live registry of reducers, keyed by their state slice name. Typed
  // loosely internally because injected reducers add keys outside S.
  const reducers: Record<string, Reducer> = { ...initialReducers };

  // Memoised combined reducer — rebuilt only when the registry changes.
  let combinedReducer = combineReducers(reducers);

  // Keys removed since the last combine — their state is stripped on next run.
  let keysToRemove: string[] = [];

  const reduce = ((state: Record<string, unknown> | undefined, action: UnknownAction) => {
    // If slices were ejected, delete their branches from state before reducing
    // so removed state doesn't linger and selectors don't read stale data.
    if (keysToRemove.length > 0 && state) {
      state = { ...state };
      for (const key of keysToRemove) {
        delete state[key];
      }
      keysToRemove = [];
    }

    return combinedReducer(state, action as Action);
  }) as Reducer<S>;

  return {
    reduce,

    getReducerMap: () => reducers,

    add: (key, reducer) => {
      if (!key || reducers[key]) return; // already injected — keep idempotent
      reducers[key] = reducer;
      combinedReducer = combineReducers(reducers);
    },

    // NOTE: remove() (and the keysToRemove cleanup in `reduce` above) is part of
    // the canonical reducer-manager pattern but is intentionally UNUSED here.
    // Our slices hold static reference data, so once injected we keep them
    // resident — ejecting on unmount would just rebuild identical initialState
    // on the next visit for no gain. Kept ready for slices that should be torn
    // down (per-session/entity state, micro-frontends). See useInjectReducer.
    remove: (key) => {
      if (!key || !reducers[key]) return;
      delete reducers[key];
      keysToRemove.push(key);
      combinedReducer = combineReducers(reducers);
    }
  };
}
