import type { Note } from 'types/content';

export const reduxNotes: Note[] = [
  // ─── CORE ───────────────────────────────────────────────────────────────────
  {
    id: 'store',
    title: 'The Redux Store',
    summary: 'Single global object holding all app state — accessed via getState(), changed only via dispatch().',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Created with configureStore() (RTK) — one store for the entire app.',
      'getState() returns a snapshot of current state; never mutate it directly.',
      'dispatch(action) is the only way to trigger a state change.',
      'subscribe(listener) fires after every dispatch — React-Redux handles this via Provider + useSelector.',
      'State tree is composed of slices: each slice owns a subtree (e.g., state.counter, state.users).'
    ],
    gotcha:
      'Calling dispatch() inside a reducer is illegal — it causes infinite re-dispatch loops. Side effects (API calls, extra dispatches) belong in middleware or thunks.',
    codeSnippet: `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

const store = configureStore({
  reducer: { counter: counterReducer }
});

store.getState();             // { counter: { value: 0 } }
store.dispatch(increment());  // triggers reducer → new state`
  },

  {
    id: 'reducers',
    title: 'Reducers',
    summary: 'Pure functions — (state, action) => newState — the only place state transitions happen.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Must be pure: no side effects, no random values, no async code inside a reducer.',
      'Must return a new state object (or the same reference if nothing changed) — never mutate in place.',
      "RTK's createSlice wraps reducers with Immer, allowing direct \"mutation\" syntax that produces immutable output.",
      'combineReducers (auto-called by configureStore) splits the state tree so each reducer owns its slice.',
      'Default/unknown actions must return the existing state unchanged.'
    ],
    gotcha:
      "Accidentally mutating state in a plain Redux reducer (without Immer) means the reference stays the same — useSelector won't detect the change and the UI goes stale.",
    codeSnippet: `// RTK createSlice — Immer lets you "mutate" safely
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },        // Immer draft
    addAmount: (state, action) => { state.value += action.payload; }
  }
});`
  },

  {
    id: 'actions',
    title: 'Actions & Action Creators',
    summary: 'Actions are plain objects with a type field describing what happened. Action creators are functions that return them.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Action shape: { type: string, payload?: any } — type is mandatory, payload is the RTK convention.',
      "createSlice auto-generates action creators — counterSlice.actions.increment() → { type: 'counter/increment' }.",
      'Action type strings follow the "domain/eventName" convention (slice name + reducer key).',
      'Action creators have a .type property for use in extraReducers: builder.addCase(increment.type, ...).',
      'You can dispatch thunks (functions) instead of plain objects — middleware intercepts them for async work.'
    ],
    codeSnippet: `const { increment, addAmount } = counterSlice.actions;

dispatch(increment());      // { type: 'counter/increment' }
dispatch(addAmount(5));     // { type: 'counter/addAmount', payload: 5 }

// Access the type string
console.log(increment.type); // 'counter/increment'`
  },

  {
    id: 'data-flow',
    title: 'Unidirectional Data Flow',
    summary: 'State flows one way: UI dispatches → middleware → reducer computes next state → UI re-renders. Never the reverse.',
    difficulty: 'basic',
    category: 'patterns',
    keyPoints: [
      'Event in UI → dispatch(action) → middleware chain → reducer(state, action) → new state → components re-render.',
      'Components never write state directly — they only declare intent via actions.',
      'Redux DevTools can replay this flow step by step, enabling time-travel debugging.',
      'Predictability: given the same state and action, the reducer always produces the same output.'
    ],
    eli5:
      "Like ordering at a restaurant: you (UI) hand the order slip (action) to the waiter (dispatch) → kitchen (reducer) prepares the dish → it arrives at your table (re-render). You can't walk into the kitchen and cook yourself."
  },

  // ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
  {
    id: 'middleware',
    title: 'Middleware',
    summary: "Functions that intercept every dispatch call — sitting between dispatch() and the reducer to handle async work, logging, and more.",
    difficulty: 'intermediate',
    category: 'middleware',
    textbookDef:
      'Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It composes as a chain: each piece can pass the action along, transform it, delay it, or swallow it entirely.',
    keyPoints: [
      'Signature: store => next => action => { /* do work */ return next(action); }',
      'RTK includes redux-thunk by default — allows dispatching functions instead of plain action objects.',
      'Thunks receive (dispatch, getState) — enabling conditional dispatches and async sequences.',
      'Middleware executes left-to-right; each calls next(action) to pass to the next middleware.',
      'Other popular middleware: redux-logger (dev logging), RTK Query middleware (cache management).'
    ],
    gotcha:
      "Middleware order matters — error-reporting middleware should come before thunk so it catches thunk errors. RTK's getDefaultMiddleware() puts thunk first by design.",
    codeSnippet: `// Custom logging middleware
const logger = store => next => action => {
  console.log('dispatching', action.type);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().concat(logger)
});`
  },

  // ─── SELECTORS ──────────────────────────────────────────────────────────────
  {
    id: 'selectors',
    title: 'Selectors & createSelector',
    summary: "Functions that read and derive data from Redux state. createSelector memoizes results so components don't re-render on unrelated updates.",
    difficulty: 'intermediate',
    category: 'selectors',
    textbookDef:
      'A selector is a function that accepts Redux state and returns derived data. Memoized selectors (via createSelector) recompute only when their input selectors return different references, preventing unnecessary downstream work.',
    keyPoints: [
      'Simple selector: const selectCount = (state) => state.counter.value — just a function, no magic.',
      'createSelector(inputSelectors, resultFn) — resultFn re-runs only when inputs change (by reference).',
      'Co-locate selectors with their slice file and export them — import wherever needed.',
      'useSelector re-subscribes on every dispatch; memoized selectors prevent expensive re-computations.',
      "RTK ≥ 2.0: createSlice's selectors field auto-binds selectors to the slice's state path."
    ],
    gotcha:
      'A selector returning a new array/object on every call (filter(), map() inline) will cause a re-render every dispatch even if the data is identical — always memoize transformations with createSelector.',
    codeSnippet: `import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) => state.cart.items;
const selectTaxRate = (state) => state.cart.taxRate;

// Only recomputes when items or taxRate changes reference
const selectTotal = createSelector(
  [selectItems, selectTaxRate],
  (items, taxRate) =>
    items.reduce((sum, i) => sum + i.price, 0) * (1 + taxRate)
);`
  },

  // ─── PATTERNS ───────────────────────────────────────────────────────────────
  {
    id: 'normalized-state',
    title: 'Normalized State Shape',
    summary: 'Store entities as { ids: [], entities: {} } instead of nested arrays — enables O(1) lookups and avoids duplication.',
    difficulty: 'intermediate',
    category: 'patterns',
    textbookDef:
      'State normalization flattens nested data into a dictionary keyed by ID. Relationships are expressed as ID references (like a relational DB). RTK\'s createEntityAdapter automates this pattern.',
    keyPoints: [
      'Problem with arrays: searching is O(n); updating one item requires spreading the whole array.',
      "Normalized shape: { ids: ['a','b'], entities: { a: {...}, b: {...} } } — update by key is O(1).",
      'createEntityAdapter generates the normalized shape + CRUD helpers (addOne, updateOne, removeOne, upsertOne…).',
      'selectAll / selectById / selectTotal are pre-built selectors from the adapter.',
      'Cross-slice relationships use ID references, never nested objects — keeps each slice independently updatable.'
    ],
    codeSnippet: `// Flat array (hard to update by ID)
state.users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

// Normalized (RTK createEntityAdapter)
state.users = {
  ids: [1, 2],
  entities: { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
};

// O(1) lookup
const user = state.users.entities[id];`
  }
];
