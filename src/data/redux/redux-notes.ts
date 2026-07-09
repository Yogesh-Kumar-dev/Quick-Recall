import type { Note } from '@/types/content';

export const reduxNotes: Note[] = [
  // ─── CORE ───────────────────────────────────────────────────────────────────
  {
    id: 'store',
    title: 'The Redux Store',
    summary: 'Single global object holding all app state , accessed via getState(), changed only via dispatch().',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['three-principles'],
    keyPoints: [
      'Created with configureStore() (RTK) , one store for the entire app.',
      'getState() returns a snapshot of current state; never mutate it directly.',
      'dispatch(action) is the only way to trigger a state change.',
      'subscribe(listener) fires after every dispatch , React-Redux handles this via Provider + useSelector.',
      'State tree is composed of slices: each slice owns a subtree (e.g., state.counter, state.users).'
    ],
    gotcha:
      'Calling dispatch() inside a reducer is illegal , it causes infinite re-dispatch loops. Side effects (API calls, extra dispatches) belong in middleware or thunks.',
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
    summary: 'Pure functions , (state, action) => newState , the only place state transitions happen.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['store'],
    keyPoints: [
      'Must be pure: no side effects, no random values, no async code inside a reducer.',
      'Must return a new state object (or the same reference if nothing changed) , never mutate in place.',
      'RTK\'s createSlice wraps reducers with Immer, allowing direct "mutation" syntax that produces immutable output.',
      'combineReducers (auto-called by configureStore) splits the state tree so each reducer owns its slice.',
      'Default/unknown actions must return the existing state unchanged.'
    ],
    gotcha:
      "Accidentally mutating state in a plain Redux reducer (without Immer) means the reference stays the same , useSelector won't detect the change and the UI goes stale.",
    codeSnippet: `// RTK createSlice , Immer lets you "mutate" safely
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
    prerequisites: ['reducers'],
    keyPoints: [
      'Action shape: { type: string, payload?: any } , type is mandatory, payload is the RTK convention.',
      "createSlice auto-generates action creators , counterSlice.actions.increment() → { type: 'counter/increment' }.",
      'Action type strings follow the "domain/eventName" convention (slice name + reducer key).',
      'Action creators have a .type property for use in extraReducers: builder.addCase(increment.type, ...).',
      'You can dispatch thunks (functions) instead of plain objects , middleware intercepts them for async work.'
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
    prerequisites: ['actions'],
    keyPoints: [
      'Event in UI → dispatch(action) → middleware chain → reducer(state, action) → new state → components re-render.',
      'Components never write state directly , they only declare intent via actions.',
      'Redux DevTools can replay this flow step by step, enabling time-travel debugging.',
      'Predictability: given the same state and action, the reducer always produces the same output.'
    ],
    eli5: "Like ordering at a restaurant: you (UI) hand the order slip (action) to the waiter (dispatch) → kitchen (reducer) prepares the dish → it arrives at your table (re-render). You can't walk into the kitchen and cook yourself."
  },

  // ─── MIDDLEWARE ──────────────────────────────────────────────────────────────
  {
    id: 'middleware',
    title: 'Middleware',
    summary:
      'Functions that intercept every dispatch call , sitting between dispatch() and the reducer to handle async work, logging, and more.',
    difficulty: 'intermediate',
    category: 'middleware',
    prerequisites: ['data-flow'],
    textbookDef:
      'Middleware provides a third-party extension point between dispatching an action and the moment it reaches the reducer. It composes as a chain: each piece can pass the action along, transform it, delay it, or swallow it entirely.',
    keyPoints: [
      'Signature: store => next => action => { /* do work */ return next(action); }',
      'RTK includes redux-thunk by default , allows dispatching functions instead of plain action objects.',
      'Thunks receive (dispatch, getState) , enabling conditional dispatches and async sequences.',
      'Middleware executes left-to-right; each calls next(action) to pass to the next middleware.',
      'Other popular middleware: redux-logger (dev logging), RTK Query middleware (cache management).'
    ],
    gotcha:
      "Middleware order matters , error-reporting middleware should come before thunk so it catches thunk errors. RTK's getDefaultMiddleware() puts thunk first by design.",
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
    summary:
      "Functions that read and derive data from Redux state. createSelector memoizes results so components don't re-render on unrelated updates.",
    difficulty: 'intermediate',
    category: 'selectors',
    prerequisites: ['store'],
    textbookDef:
      'A selector is a function that accepts Redux state and returns derived data. Memoized selectors (via createSelector) recompute only when their input selectors return different references, preventing unnecessary downstream work.',
    keyPoints: [
      'Simple selector: const selectCount = (state) => state.counter.value , just a function, no magic.',
      'createSelector(inputSelectors, resultFn) , resultFn re-runs only when inputs change (by reference).',
      'Co-locate selectors with their slice file and export them , import wherever needed.',
      'useSelector re-subscribes on every dispatch; memoized selectors prevent expensive re-computations.',
      "RTK ≥ 2.0: createSlice's selectors field auto-binds selectors to the slice's state path."
    ],
    gotcha:
      'A selector returning a new array/object on every call (filter(), map() inline) will cause a re-render every dispatch even if the data is identical , always memoize transformations with createSelector.',
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
    summary: 'Store entities as { ids: [], entities: {} } instead of nested arrays , enables O(1) lookups and avoids duplication.',
    difficulty: 'intermediate',
    category: 'patterns',
    prerequisites: ['selectors'],
    textbookDef:
      "State normalization flattens nested data into a dictionary keyed by ID. Relationships are expressed as ID references (like a relational DB). RTK's createEntityAdapter automates this pattern.",
    keyPoints: [
      'Problem with arrays: searching is O(n); updating one item requires spreading the whole array.',
      "Normalized shape: { ids: ['a','b'], entities: { a: {...}, b: {...} } } , update by key is O(1).",
      'createEntityAdapter generates the normalized shape + CRUD helpers (addOne, updateOne, removeOne, upsertOne…).',
      'selectAll / selectById / selectTotal are pre-built selectors from the adapter.',
      'Cross-slice relationships use ID references, never nested objects , keeps each slice independently updatable.'
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
  },

  // ─── CORE (from the Redux interview question bank) ───────────────────────────
  {
    id: 'what-is-redux',
    title: 'What is Redux?',
    summary: 'A predictable state container , a centralized global store updated only by dispatching actions to pure reducers.',
    difficulty: 'basic',
    category: 'core',
    keyPoints: [
      'Centralizes app state in one store (single source of truth).',
      'Four pieces: Store (holds state), Actions (describe changes), Reducers (apply them), View (renders state).',
      'Unidirectional data flow: dispatch → reducer → new state → re-render.',
      'Library-agnostic; most commonly paired with React via react-redux.',
      'Benefits: predictable updates, centralized state, easier debugging (time travel).'
    ],
    textbookDef:
      'Redux is a predictable state container for JavaScript applications. It stores the whole application state in a single immutable tree and allows changes only through dispatched actions processed by pure reducer functions, yielding a deterministic, traceable state-management model.',
    eli5: 'Redux is like a single shared whiteboard for your whole app. No one scribbles on it directly , you hand a written note (action) to a referee (reducer) who erases and rewrites the board following strict rules. Everyone watching the board updates automatically.',
    codeSnippet: `// The four pieces in miniature
const action = { type: 'INCREMENT' };               // 1. Action
const reducer = (s = { n: 0 }, a) =>                 // 2. Reducer
  a.type === 'INCREMENT' ? { n: s.n + 1 } : s;
const store = createStore(reducer);                  // 3. Store
store.subscribe(() => render(store.getState()));     // 4. View
store.dispatch(action);`
  },
  {
    id: 'three-principles',
    title: 'The Three Principles of Redux',
    summary: 'Single source of truth, state is read-only, and changes are made with pure functions.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['what-is-redux'],
    keyPoints: [
      '1) Single source of truth: the whole app state lives in one store tree.',
      '2) State is read-only: the only way to change it is to dispatch an action.',
      '3) Changes with pure functions: reducers are pure (state, action) => newState.',
      'Together they make state predictable, centralized, and time-travel-debuggable.',
      'Recording actions enables replay and reverting to past states.'
    ],
    gotcha:
      'Breaking principle 3 , doing async or mutating inside a reducer , destroys predictability and breaks DevTools time travel. Keep side effects in middleware.',
    codeSnippet: `// Principle 2 & 3: never mutate; return a new object
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD': return { ...state, items: [...state.items, action.payload] };
    default: return state;
  }
};`
  },
  {
    id: 'immutable-state',
    title: 'Immutable State',
    summary: 'State is never mutated in place , every change produces a new object, enabling fast change detection and time travel.',
    difficulty: 'intermediate',
    category: 'core',
    prerequisites: ['three-principles'],
    keyPoints: [
      'Reducers return a NEW state object rather than editing the existing one.',
      'Enables reference-equality checks: unchanged slices skip re-renders.',
      'Preserves state history , supports undo/redo and time-travel debugging.',
      'Achieve it with the spread operator (shallow) or a deep clone (costly).',
      'Libraries: Immer (mutate a draft, get immutable output) or Immutable.js.'
    ],
    gotcha:
      'const only freezes the binding, not the object’s contents. state.items.push(x) still mutates , use [...state.items, x] or Immer instead.',
    codeSnippet: `// ❌ mutation , same reference, UI won't update
state.user.name = 'Bob';

// ✅ new reference
return { ...state, user: { ...state.user, name: 'Bob' } };

// ✅ with Immer (RTK createSlice) — "mutate" the draft safely
increment: (state) => { state.value += 1; }`
  },
  {
    id: 'combine-reducers',
    title: 'combineReducers',
    summary: 'Merges multiple slice reducers into one root reducer, each owning its own subtree of the state.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['reducers'],
    keyPoints: [
      'combineReducers({ notes, ui, user }) builds a root reducer.',
      'Each slice reducer manages only its own key (state.notes, state.ui…).',
      'Every dispatched action is passed to every slice reducer.',
      'Improves modularity, clarity, and reuse vs one giant reducer.',
      'configureStore (RTK) calls combineReducers for you when you pass a reducer map.'
    ],
    codeSnippet: `import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  notes: notesReducer,
  ui: uiReducer,
  user: userReducer
});
// state shape → { notes: ..., ui: ..., user: ... }`
  },
  {
    id: 'pure-functions-side-effects',
    title: 'Pure Functions & Side Effects',
    summary: 'Reducers must be pure; side effects (API calls, I/O) belong in middleware, not reducers.',
    difficulty: 'intermediate',
    category: 'core',
    prerequisites: ['reducers'],
    keyPoints: [
      'Pure function: output depends only on input; no external state, no I/O, no randomness.',
      'Same (state, action) input must always yield the same output , idempotent.',
      'Reducers must NOT mutate arguments, call APIs, or read Date.now()/Math.random().',
      'Side effects are handled by middleware: redux-thunk, redux-saga.',
      'Keeping reducers pure is what makes Redux testable and time-travel-debuggable.'
    ],
    gotcha:
      'A reducer that reads or writes anything outside its arguments (a global, the network, the clock) is impure and makes state non-reproducible.',
    codeSnippet: `// ❌ impure , depends on/changes outside state
let count = 0;
const bad = () => { count += 1; return count; };

// ✅ pure — output is a function of input only
const good = (state, action) =>
  action.type === 'INC' ? { n: state.n + 1 } : state;`
  },

  // ─── ASYNC ───────────────────────────────────────────────────────────────────
  {
    id: 'async-actions',
    title: 'Async Actions (Thunk & Saga)',
    summary: 'Plain Redux is synchronous; middleware like redux-thunk or redux-saga handles async work.',
    difficulty: 'intermediate',
    category: 'async',
    prerequisites: ['middleware'],
    keyPoints: [
      'Reducers are synchronous , async logic cannot live there.',
      'redux-thunk lets an action creator return a function (dispatch, getState) instead of an object.',
      'Typical pattern: dispatch REQUEST → await API → dispatch SUCCESS or FAILURE.',
      'redux-saga uses generator functions and effects (call, put, takeLatest) for complex flows.',
      'RTK: createAsyncThunk wraps this pattern and auto-dispatches pending/fulfilled/rejected.'
    ],
    textbookDef:
      'Asynchronous behavior in Redux is implemented through middleware that intercepts dispatched functions or generator-driven effects, allowing side-effectful operations (such as network requests) to dispatch plain actions at appropriate points in the async lifecycle while keeping reducers pure.',
    gotcha:
      'Without thunk/saga middleware, dispatching a function throws "Actions must be plain objects" , async needs middleware installed.',
    codeSnippet: `// redux-thunk
const fetchData = () => async (dispatch) => {
  dispatch({ type: 'FETCH_REQUEST' });
  try {
    const data = await api();
    dispatch({ type: 'FETCH_SUCCESS', payload: data });
  } catch (err) {
    dispatch({ type: 'FETCH_FAILURE', error: err.message });
  }
};`
  },

  // ─── PATTERNS ───────────────────────────────────────────────────────────────
  {
    id: 'redux-vs-local-state',
    title: 'Redux vs Local Component State',
    summary: 'Local state is simple and scoped; Redux centralizes shared state and avoids prop drilling , worth it at scale.',
    difficulty: 'basic',
    category: 'patterns',
    prerequisites: ['what-is-redux'],
    keyPoints: [
      'Local state (useState): quick, scoped, ideal for UI-only or small apps.',
      'Local-state pain at scale: duplication/sync bugs and deep prop drilling.',
      'Redux: centralized single source of truth, predictable updates, time-travel debugging.',
      'Redux shares data across distant components without threading props through every level.',
      'Rule of thumb: local for component-private state; Redux for cross-cutting, multi-level shared state.'
    ],
    gotcha:
      'Reaching for Redux for every piece of state is over-engineering. Keep purely local, UI-only state in useState; lift to Redux only when it is genuinely shared.',
    codeSnippet: `// Local , fine for an isolated toggle
const [open, setOpen] = useState(false);

// Redux — when many distant components need the same data
const user = useSelector((s) => s.auth.user);
const dispatch = useDispatch();`
  },

  // ─── REACT-REDUX (focused subset, topics 16–45) ──────────────────────────────
  {
    id: 'react-redux-provider',
    title: 'Provider & Accessing the Store',
    summary: '<Provider store> exposes the store to the React tree via context; components read it with hooks or connect.',
    difficulty: 'basic',
    category: 'react-redux',
    prerequisites: ['store'],
    keyPoints: [
      '<Provider store={store}> wraps the app root and shares the store through React context.',
      'Modern access: the useSelector and useDispatch hooks from react-redux.',
      'Legacy access: the connect() higher-order component.',
      'Without a Provider above them, useSelector/connect throw "could not find store".',
      'One Provider per store; nest only for advanced multi-store cases.'
    ],
    codeSnippet: `import { Provider } from 'react-redux';
import { store } from './store';

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);`
  },
  {
    id: 'react-redux-hooks',
    title: 'useSelector & useDispatch',
    summary: 'The modern hooks API: read state with useSelector, dispatch actions with useDispatch.',
    difficulty: 'basic',
    category: 'react-redux',
    prerequisites: ['react-redux-provider'],
    keyPoints: [
      'useSelector(selectorFn) reads a value and re-renders when that value changes (=== comparison).',
      'useDispatch() returns the dispatch function to send actions.',
      'Select the smallest slice you need , selecting the whole state re-renders on every change.',
      'Returning a new object/array from a selector each call defeats the === check (use shallowEqual or a memoized selector).',
      'Hooks replaced connect for most new code , less boilerplate, better TS inference.'
    ],
    gotcha:
      'useSelector(s => ({ a: s.a, b: s.b })) returns a NEW object every run → re-renders every dispatch. Use separate selectors or pass shallowEqual as the second arg.',
    codeSnippet: `import { useSelector, useDispatch } from 'react-redux';

function Cart() {
  const total = useSelector((s) => s.cart.total); // narrow slice
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(clearCart())}>{total}</button>;
}`
  },
  {
    id: 'react-redux-connect',
    title: 'connect, mapStateToProps & mapDispatchToProps',
    summary: 'The legacy HOC that injects store state and bound action creators as props.',
    difficulty: 'intermediate',
    category: 'react-redux',
    prerequisites: ['react-redux-hooks'],
    keyPoints: [
      'connect(mapStateToProps, mapDispatchToProps)(Component) subscribes the component to the store.',
      'mapStateToProps(state, ownProps) → props derived from state; runs on every store change.',
      'mapDispatchToProps: an object of action creators is auto-wrapped with dispatch.',
      'Encourages the container (smart) vs presentational (dumb) split.',
      'Still valid and used in older codebases, but hooks are preferred for new code.'
    ],
    codeSnippet: `import { connect } from 'react-redux';

const mapState = (state) => ({ count: state.counter.value });
const mapDispatch = { increment, decrement }; // object shorthand

export default connect(mapState, mapDispatch)(Counter);`
  },

  // ─── PATTERNS (focused subset) ───────────────────────────────────────────────
  {
    id: 'reducer-composition',
    title: 'Reducer Composition & the Ducks Pattern',
    summary: 'Split state handling into small slice reducers; co-locate a feature’s types, creators, and reducer in one module.',
    difficulty: 'intermediate',
    category: 'patterns',
    prerequisites: ['combine-reducers'],
    keyPoints: [
      'Reducer composition: many small slice reducers combined by combineReducers.',
      'Each reducer owns one subtree and ignores actions it doesn’t care about.',
      'Ducks pattern: put action types + action creators + reducer for a feature in ONE file.',
      'Ducks reduces the file-hopping of the classic types/actions/reducers separation.',
      'RTK’s createSlice is the modern, formalized version of Ducks.'
    ],
    codeSnippet: `// counterDuck.js , types, creators, reducer in one module
const INCREMENT = 'counter/increment';
export const increment = () => ({ type: INCREMENT });
export default function reducer(state = { n: 0 }, action) {
  switch (action.type) {
    case INCREMENT: return { n: state.n + 1 };
    default: return state;
  }
}`
  },
  {
    id: 'reset-store',
    title: 'Resetting Store State & Higher-Order Reducers',
    summary: 'Wrap the root reducer to reset state on a special action , a common Higher-Order Reducer use case.',
    difficulty: 'intermediate',
    category: 'patterns',
    prerequisites: ['combine-reducers'],
    keyPoints: [
      'A Higher-Order Reducer (HOR) takes a reducer and returns an enhanced reducer.',
      'Reset pattern: on a RESET action, pass undefined as state so each slice reverts to its initialState.',
      'Useful on logout, "start over" flows, or clearing per-session data.',
      'HORs also enable reusable behaviors like undo/redo and pagination wrappers.',
      'Keep the wrapper generic so it composes over any root reducer.'
    ],
    gotcha:
      'Don’t mutate or hand-clear every slice on reset , delegating to each reducer with undefined state lets them define their own initial values in one place.',
    codeSnippet: `const rootReducer = combineReducers({ user, cart });

// HOR: reset everything on LOGOUT
const resettable = (state, action) =>
  action.type === 'LOGOUT'
    ? rootReducer(undefined, action) // each slice → its initialState
    : rootReducer(state, action);`
  },

  // ─── MIDDLEWARE (focused subset) ─────────────────────────────────────────────
  {
    id: 'custom-middleware',
    title: 'Writing Custom Middleware',
    summary: 'The store => next => action => {…} signature lets you log, transform, delay, or block actions.',
    difficulty: 'advanced',
    category: 'middleware',
    prerequisites: ['middleware'],
    keyPoints: [
      'Signature: store => next => action => { … } , three curried functions.',
      'Call next(action) to pass the action to the next middleware/reducer.',
      'Access store.getState() and store.dispatch() inside for conditional logic.',
      'Skip next(action) to swallow an action; call dispatch() to add new ones.',
      'Registered via configureStore’s middleware option (concat onto the defaults).'
    ],
    gotcha: 'Forgetting to call next(action) silently drops the action , the reducer never sees it and state never updates.',
    codeSnippet: `const logger = (store) => (next) => (action) => {
  console.log('dispatching', action.type);
  const result = next(action);          // pass it on — don't forget!
  console.log('next state', store.getState());
  return result;
};

configureStore({ reducer, middleware: (gdm) => gdm().concat(logger) });`
  },

  // ─── SELECTORS (focused subset) ──────────────────────────────────────────────
  {
    id: 'reselect',
    title: 'reselect & Memoized Selectors',
    summary: 'createSelector caches derived data, recomputing only when its input selectors change by reference.',
    difficulty: 'intermediate',
    category: 'selectors',
    prerequisites: ['selectors'],
    keyPoints: [
      'reselect provides createSelector(inputSelectors, resultFn).',
      'resultFn re-runs only when an input selector returns a new reference.',
      'Avoids recomputing expensive derivations (filter/sort/aggregate) every render.',
      'Prevents new-reference re-renders when the derived data is unchanged.',
      'Selectors compose , feed one memoized selector into another.'
    ],
    gotcha:
      'A default createSelector caches only the LAST call. For per-item or per-component args, create a selector instance per use (selector factory) to avoid cache thrashing.',
    codeSnippet: `import { createSelector } from 'reselect';

const selectItems = (s) => s.cart.items;
const selectVisible = createSelector(
  [selectItems, (s) => s.cart.filter],
  (items, filter) => items.filter((i) => i.tag === filter) // memoized
);`
  },

  // ─── CORE / TOOLING (focused subset) ─────────────────────────────────────────
  {
    id: 'redux-devtools',
    title: 'Redux DevTools',
    summary: 'A browser extension to inspect state, replay actions, and time-travel through state changes.',
    difficulty: 'basic',
    category: 'core',
    prerequisites: ['store'],
    keyPoints: [
      'Inspect the live state tree and every dispatched action with its payload.',
      'Time-travel: step back/forward, replay, or revert to any past state.',
      'Diff view shows exactly what each action changed.',
      'configureStore (RTK) wires it up automatically in development.',
      'Works because Redux records actions and state is immutable.'
    ],
    codeSnippet: `// RTK: DevTools enabled in development by default
const store = configureStore({ reducer: rootReducer });

// Classic Redux: compose with the extension enhancer
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store2 = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));`
  },
  {
    id: 'redux-toolkit',
    title: 'Redux Toolkit (RTK)',
    summary: 'The official, recommended toolset that removes most Redux boilerplate.',
    difficulty: 'intermediate',
    category: 'core',
    prerequisites: ['what-is-redux'],
    keyPoints: [
      'configureStore: sets up the store with DevTools and thunk by default.',
      'createSlice: name + initialState + reducers → auto-generated action creators (Immer-powered).',
      'createAsyncThunk: standardizes async flows (pending/fulfilled/rejected actions).',
      'createEntityAdapter: normalized state + CRUD reducers and selectors.',
      'RTK Query: built-in data fetching & caching layer on top of RTK.'
    ],
    textbookDef:
      'Redux Toolkit is the official, opinionated toolset for efficient Redux development. It packages store configuration, Immer-based reducer authoring, action-creator generation, async-thunk handling, and entity normalization into a small, batteries-included API that is the recommended way to write Redux today.',
    codeSnippet: `import { createSlice, configureStore } from '@reduxjs/toolkit';

const counter = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: { increment: (s) => { s.value += 1; } } // Immer draft
});

export const { increment } = counter.actions;
const store = configureStore({ reducer: { counter: counter.reducer } });`
  }
];
