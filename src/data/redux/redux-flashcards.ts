import type { Flashcard } from 'types/content';

// ─── Redux flashcards — keyword/abbreviation defs + small Q&A ─────────────────
// Seeded incrementally; empty arrays hide the Flashcards button on the landing.

export const reduxFlashcards: Flashcard[] = [
  {
    id: 'redux-what-is',
    front: 'What is Redux?',
    back: 'A predictable state container for JS apps — a centralized global store holding all app state, updated only by dispatching actions to pure reducers. Library-agnostic (commonly used with React via react-redux).',
    category: 'Q&A'
  },
  {
    id: 'redux-three-principles',
    front: 'The 3 principles of Redux',
    back: '1) Single source of truth (one state tree). 2) State is read-only (change only by dispatching actions). 3) Changes are made with pure functions (reducers).',
    category: 'Q&A'
  },
  {
    id: 'redux-store',
    front: 'Store',
    back: 'The central object holding the app state tree. Exposes getState(), dispatch(action), and subscribe(listener). The single source of truth.',
    category: 'Keyword'
  },
  {
    id: 'redux-action',
    front: 'Action',
    back: 'A plain object describing what happened. Must have a `type`; optionally a `payload`. The only way to send data to the store, e.g. { type: "ADD_TODO", payload: {...} }.',
    category: 'Keyword'
  },
  {
    id: 'redux-action-creator',
    front: 'Action creator',
    back: 'A function that builds and returns an action object — e.g. const increment = () => ({ type: "INCREMENT" }). Keeps action construction consistent and reusable.',
    category: 'Keyword'
  },
  {
    id: 'redux-reducer',
    front: 'Reducer',
    back: 'A pure function (state, action) => newState that computes the next state. Must be deterministic, side-effect-free, and return a NEW state object (never mutate).',
    category: 'Keyword'
  },
  {
    id: 'redux-single-source',
    front: 'Single source of truth',
    back: 'The entire app state lives in one immutable tree in the store — making state predictable, easy to debug, and consistent across all components.',
    category: 'Q&A'
  },
  {
    id: 'redux-state-read-only',
    front: 'Why is Redux state “read-only”?',
    back: 'You never mutate state directly; you dispatch actions describing the change. This gives a controlled mutation path, predictability, and time-travel debugging.',
    category: 'Q&A'
  },
  {
    id: 'redux-immutable-state',
    front: 'Why immutable state?',
    back: 'Enables reference-equality checks (skip re-renders when state is unchanged), state history / undo-redo, and predictable updates. Ensure it with the spread operator, Immer, or Immutable.js.',
    category: 'Q&A'
  },
  {
    id: 'redux-data-flow',
    front: 'Redux data flow',
    back: 'Unidirectional: UI dispatches an action → store passes it to reducers → reducers return new state → subscribed components re-render. Never the reverse.',
    category: 'Q&A'
  },
  {
    id: 'redux-dispatch',
    front: 'store.dispatch(action)',
    back: 'The only way to trigger a state change. Sends the action through middleware to the reducers, producing a new state and notifying subscribers.',
    category: 'Keyword'
  },
  {
    id: 'redux-createstore',
    front: 'createStore vs configureStore',
    back: 'createStore(reducer, preloadedState?, enhancer) is classic Redux. Modern Redux Toolkit prefers configureStore, which wires DevTools and thunk by default.',
    category: 'Q&A'
  },
  {
    id: 'redux-combinereducers',
    front: 'combineReducers',
    back: 'Merges multiple slice reducers into one root reducer; each manages its own subtree (state.notes, state.user). Improves modularity and lets each reducer listen only to its slice.',
    category: 'Keyword'
  },
  {
    id: 'redux-pure-side-effects',
    front: 'Pure functions vs side effects in Redux',
    back: 'Reducers must be PURE — output depends only on input, no I/O or external mutation. Side effects (API calls, timers) live in middleware like redux-thunk or redux-saga.',
    category: 'Q&A'
  },
  {
    id: 'redux-thunk',
    front: 'redux-thunk',
    back: 'Middleware that lets action creators return a FUNCTION (dispatch, getState) instead of a plain object — enabling async flows (dispatch request → await API → dispatch success/failure).',
    category: 'Keyword'
  },
  {
    id: 'redux-saga',
    front: 'redux-saga',
    back: 'Middleware using generator functions to manage side effects via effects like call, put, takeLatest — good for complex/concurrent async flows. An alternative to thunks.',
    category: 'Keyword'
  },
  {
    id: 'redux-async-actions',
    front: 'How do you handle async in Redux?',
    back: 'Plain Redux only does synchronous updates. Use middleware (redux-thunk most commonly) so action creators can run async work and dispatch request/success/failure actions around it.',
    category: 'Q&A'
  },
  {
    id: 'redux-selector',
    front: 'Selector',
    back: 'A pure function that reads/derives data from store state, e.g. (state) => state.user.email. Centralizes state access and (when memoized) avoids recomputation.',
    category: 'Keyword'
  },
  {
    id: 'redux-reselect',
    front: 'createSelector (memoized selector)',
    back: 'Builds a selector that caches its result and recomputes only when its input selectors change by reference — preventing expensive recalculations and needless re-renders.',
    category: 'Keyword'
  },
  {
    id: 'redux-vs-local-state',
    front: 'Redux vs local component state',
    back: 'Local state: simple, scoped, best for small/UI-only state. Redux: centralized, shareable across the tree without prop drilling, predictable — worth it for larger apps with shared, multi-level state.',
    category: 'Q&A'
  },

  // ─── Focused subset (topics 16–60 from the question bank) ───────────────────
  {
    id: 'redux-provider',
    front: 'Provider (react-redux)',
    back: 'The top-level component that makes the store available to the whole React tree via context: <Provider store={store}><App/></Provider>. Hooks/connect read from it.',
    category: 'Keyword'
  },
  {
    id: 'redux-useselector',
    front: 'useSelector',
    back: 'A react-redux hook that reads a value from store state and re-renders the component when that selected value changes (compared with strict ===). e.g. useSelector(s => s.cart.total).',
    category: 'Keyword'
  },
  {
    id: 'redux-usedispatch',
    front: 'useDispatch',
    back: 'A react-redux hook returning the store’s dispatch function so a component can dispatch actions: const dispatch = useDispatch(); dispatch(increment()).',
    category: 'Keyword'
  },
  {
    id: 'redux-connect',
    front: 'connect()',
    back: 'The legacy HOC that subscribes a component to the store: connect(mapStateToProps, mapDispatchToProps)(Component). Hooks (useSelector/useDispatch) are now preferred.',
    category: 'Keyword'
  },
  {
    id: 'redux-mapstate-mapdispatch',
    front: 'mapStateToProps / mapDispatchToProps',
    back: 'connect’s two arguments: mapStateToProps(state) injects derived state as props; mapDispatchToProps wraps action creators as props that auto-dispatch.',
    category: 'Q&A'
  },
  {
    id: 'redux-container-presentational',
    front: 'Container vs presentational component',
    back: 'Container (“smart”): connects to the store, supplies data/handlers. Presentational (“dumb”): just renders props. With hooks the split is now usually a custom hook, not a wrapper.',
    category: 'Q&A'
  },
  {
    id: 'redux-subscribe',
    front: 'store.subscribe(listener)',
    back: 'Registers a callback invoked after every dispatched action. Returns an unsubscribe function. react-redux uses this internally so you rarely call it directly.',
    category: 'Keyword'
  },
  {
    id: 'redux-slice',
    front: 'Slice',
    back: 'The portion of state owned by one reducer (e.g. state.cart). RTK’s createSlice bundles a slice’s name, initial state, reducers, and auto-generated action creators.',
    category: 'Keyword'
  },
  {
    id: 'redux-reducer-composition',
    front: 'Reducer composition',
    back: 'Splitting state handling into small slice reducers and combining them with combineReducers. Each reducer manages its own subtree — modular, testable, scalable.',
    category: 'Q&A'
  },
  {
    id: 'redux-ducks',
    front: 'Ducks pattern',
    back: 'A file convention that co-locates a feature’s action types, action creators, and reducer in ONE module (instead of separate files) — reducing boilerplate. RTK’s createSlice formalizes this.',
    category: 'Keyword'
  },
  {
    id: 'redux-custom-middleware',
    front: 'Custom middleware signature',
    back: 'store => next => action => { … }. Call next(action) to pass it down the chain; you can log, transform, delay, or block the action before it reaches the reducer.',
    category: 'Keyword'
  },
  {
    id: 'redux-reset-state',
    front: 'How do you reset the whole Redux store?',
    back: 'Wrap the root reducer: if the action is a RESET type, ignore state and call the reducer with undefined so each slice falls back to its initialState.',
    category: 'Q&A'
  },
  {
    id: 'redux-higher-order-reducer',
    front: 'Higher-Order Reducer (HOR)',
    back: 'A function that takes a reducer and returns an enhanced reducer — used to add reusable behavior (reset, undo/redo, pagination) across many reducers.',
    category: 'Keyword'
  },
  {
    id: 'redux-reselect',
    front: 'reselect',
    back: 'The library providing createSelector — memoized selectors that recompute only when their inputs change by reference, avoiding wasted recalculation and re-renders.',
    category: 'Keyword'
  },
  {
    id: 'redux-devtools',
    front: 'Redux DevTools',
    back: 'A browser extension to inspect the state tree, view every dispatched action, and time-travel (replay/revert). configureStore enables it automatically in development.',
    category: 'Keyword'
  },
  {
    id: 'redux-normalization-why',
    front: 'Why normalize state?',
    back: 'Storing entities as { ids: [], entities: {} } gives O(1) lookups/updates by id, removes duplication, and keeps slices independently updatable. RTK’s createEntityAdapter automates it.',
    category: 'Q&A'
  },
  {
    id: 'redux-toolkit',
    front: 'Redux Toolkit (RTK)',
    back: 'The official, recommended way to write Redux: configureStore, createSlice (Immer + auto action creators), createAsyncThunk, and createEntityAdapter — far less boilerplate.',
    category: 'Keyword'
  }
];

export const reduxToolkitFlashcards: Flashcard[] = [];

export const rtkQueryFlashcards: Flashcard[] = [];

export const asyncThunkFlashcards: Flashcard[] = [];
