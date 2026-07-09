import type { Flashcard } from '@/types/content';

// ─── Redux flashcards — keyword/abbreviation defs + small Q&A ─────────────────
// One export per topic (redux, redux-toolkit, rtk-query, async-thunk), all wired into
// flashcard-sets.ts. An empty array here hides that set's card on the /flashcards index.

export const reduxFlashcards: Flashcard[] = [
  {
    id: 'redux-what-is',
    front: 'What is Redux?',
    back: 'A predictable state container for JS apps , a centralized global store holding all app state, updated only by dispatching actions to pure reducers. Library-agnostic (commonly used with React via react-redux).',
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
    back: 'A function that builds and returns an action object , e.g. const increment = () => ({ type: "INCREMENT" }). Keeps action construction consistent and reusable.',
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
    back: 'The entire app state lives in one immutable tree in the store , making state predictable, easy to debug, and consistent across all components.',
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
    back: 'Reducers must be PURE , output depends only on input, no I/O or external mutation. Side effects (API calls, timers) live in middleware like redux-thunk or redux-saga.',
    category: 'Q&A'
  },
  {
    id: 'redux-thunk',
    front: 'redux-thunk',
    back: 'Middleware that lets action creators return a FUNCTION (dispatch, getState) instead of a plain object , enabling async flows (dispatch request → await API → dispatch success/failure).',
    category: 'Keyword'
  },
  {
    id: 'redux-saga',
    front: 'redux-saga',
    back: 'Middleware using generator functions to manage side effects via effects like call, put, takeLatest , good for complex/concurrent async flows. An alternative to thunks.',
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
    back: 'Builds a selector that caches its result and recomputes only when its input selectors change by reference , preventing expensive recalculations and needless re-renders.',
    category: 'Keyword'
  },
  {
    id: 'redux-vs-local-state',
    front: 'Redux vs local component state',
    back: 'Local state: simple, scoped, best for small/UI-only state. Redux: centralized, shareable across the tree without prop drilling, predictable , worth it for larger apps with shared, multi-level state.',
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
    back: 'Splitting state handling into small slice reducers and combining them with combineReducers. Each reducer manages its own subtree , modular, testable, scalable.',
    category: 'Q&A'
  },
  {
    id: 'redux-ducks',
    front: 'Ducks pattern',
    back: 'A file convention that co-locates a feature’s action types, action creators, and reducer in ONE module (instead of separate files) , reducing boilerplate. RTK’s createSlice formalizes this.',
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
    back: 'A function that takes a reducer and returns an enhanced reducer , used to add reusable behavior (reset, undo/redo, pagination) across many reducers.',
    category: 'Keyword'
  },
  {
    id: 'redux-reselect',
    front: 'reselect',
    back: 'The library providing createSelector , memoized selectors that recompute only when their inputs change by reference, avoiding wasted recalculation and re-renders.',
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
    back: 'The official, recommended way to write Redux: configureStore, createSlice (Immer + auto action creators), createAsyncThunk, and createEntityAdapter , far less boilerplate.',
    category: 'Keyword'
  }
];

export const reduxToolkitFlashcards: Flashcard[] = [
  {
    id: 'rtk-configure-store',
    front: 'configureStore',
    back: "RTK's store factory , auto-combines your reducer map, includes redux-thunk and dev-mode checks (serializability, immutability) by default, and wires up Redux DevTools without any extra setup.",
    code: `const store = configureStore({ reducer: { counter: counterReducer } });`,
    category: 'Q&A'
  },
  {
    id: 'rtk-create-slice',
    front: 'createSlice',
    back: 'Generates a reducer AND its action creators from one object: name, initialState, reducers. Each reducer key becomes both a case handler and an auto-generated action creator , the primary way to write Redux logic in RTK.',
    category: 'Keyword'
  },
  {
    id: 'rtk-immer',
    front: 'How does createSlice let you "mutate" state?',
    back: 'It wraps each reducer with Immer, which gives you a draft proxy , write state.value++ and Immer produces a real immutable update behind the scenes. Return a new value OR mutate the draft, never both in the same reducer.',
    category: 'Q&A'
  },
  {
    id: 'rtk-extra-reducers',
    front: 'extraReducers',
    back: "Lets a slice respond to actions defined elsewhere (another slice, or a thunk's pending/fulfilled/rejected) using the builder pattern: builder.addCase(actionCreator, reducer). Unlike reducers, it doesn't generate new action creators.",
    code: `extraReducers: (builder) => {
  builder.addCase(fetchUsers.fulfilled, (state, action) => {
    state.list = action.payload;
  });
}`,
    category: 'Q&A'
  },
  {
    id: 'rtk-entity-adapter',
    front: 'createEntityAdapter',
    back: 'Generates a normalized { ids, entities } state shape plus ready-made CRUD reducers (addOne, updateOne, removeOne…) and selectors (selectAll, selectById, selectTotal) for a collection , automates the normalization pattern.',
    category: 'Keyword'
  },
  {
    id: 'rtk-typed-hooks',
    front: 'Typed useAppSelector / useAppDispatch',
    back: 'Infer RootState = ReturnType<typeof store.getState> and AppDispatch = typeof store.dispatch, then wrap useSelector/useDispatch with those types once , every component gets full autocomplete with zero repeated generics.',
    category: 'Q&A'
  },
  {
    id: 'rtk-listener-middleware',
    front: 'createListenerMiddleware',
    back: "RTK's lighter alternative to redux-saga/redux-observable. startListening({ actionCreator, effect }) runs a side effect when a matching action fires; the effect gets dispatch/getState plus async helpers like condition() and fork().",
    category: 'Keyword'
  }
];

export const rtkQueryFlashcards: Flashcard[] = [
  {
    id: 'rtkq-create-api',
    front: 'createApi & fetchBaseQuery',
    back: 'createApi defines your whole API surface (endpoints, base URL, tag types) in one place; fetchBaseQuery is a thin fetch wrapper for it. You must add both api.reducer and api.middleware to the store , easy to forget the middleware.',
    category: 'Q&A'
  },
  {
    id: 'rtkq-query-hooks',
    front: 'Auto-generated query hooks',
    back: 'Each query endpoint gets a use + PascalCase(name) + Query hook. isLoading is true only on the very first load; isFetching is true on ANY in-flight request (including background re-fetches) , data persists from the last success meanwhile.',
    category: 'Q&A'
  },
  {
    id: 'rtkq-mutation-hooks',
    front: 'Mutation hooks',
    back: "A mutation endpoint's hook returns [triggerFn, status] instead of auto-fetching , call triggerFn(args). triggerFn returns a promise; .unwrap() on it gives the payload or throws, letting you await/try-catch like a normal async call.",
    code: `const [addPost, { isLoading }] = useAddPostMutation();
await addPost(data).unwrap();`,
    category: 'Q&A'
  },
  {
    id: 'rtkq-cache-tags',
    front: 'providesTags & invalidatesTags',
    back: "Queries declare what data they represent (providesTags); mutations declare what they make stale (invalidatesTags). Any overlap triggers an automatic refetch of just the affected queries , RTK Query's cache-invalidation mechanism.",
    category: 'Q&A'
  },
  {
    id: 'rtkq-cache-lifecycle',
    front: 'keepUnusedDataFor',
    back: 'How long (seconds, default 60) a cache entry survives after its last subscribed component unmounts before being garbage-collected. RTK Query counts active subscribers per unique endpoint+arg combination to track this.',
    category: 'Keyword'
  },
  {
    id: 'rtkq-optimistic-updates',
    front: 'Optimistic updates',
    back: "Inside a mutation's onQueryStarted, dispatch api.util.updateQueryData(...) to patch the cache immediately, before the server responds. If the real request fails, call the returned patchResult.undo() to roll the UI back.",
    category: 'Q&A'
  },
  {
    id: 'rtkq-polling',
    front: 'Polling',
    back: 'Pass pollingInterval (ms) to a query hook to re-fetch on a timer , a simple way to approximate real-time data. skipPollingIfUnfocused pauses it while the tab is unfocused (needs setupListeners(store.dispatch) once).',
    category: 'Keyword'
  },
  {
    id: 'rtkq-lazy-queries',
    front: 'Lazy queries',
    back: 'useLazyGetXQuery() returns [trigger, result] and does NOT fetch on mount , you call trigger(arg) manually. Built for search-as-you-type or fetch-on-click flows where an automatic useQuery would fire too eagerly.',
    category: 'Q&A'
  }
];

export const asyncThunkFlashcards: Flashcard[] = [
  {
    id: 'thunk-basics',
    front: 'createAsyncThunk',
    back: "Wraps an async payloadCreator function and auto-dispatches pending/fulfilled/rejected actions around it , dispatch(myThunk()) fires 'pending' immediately, then 'fulfilled' (with the return value as payload) or 'rejected' on throw.",
    category: 'Keyword'
  },
  {
    id: 'thunk-lifecycle-actions',
    front: 'Handling thunk lifecycle actions',
    back: 'pending/fulfilled/rejected are handled in extraReducers via builder.addCase , the standard pattern sets a status field ("idle"|"loading"|"succeeded"|"failed") on pending and stores the payload or error on the other two.',
    category: 'Q&A'
  },
  {
    id: 'thunk-api-object',
    front: 'thunkAPI',
    back: 'The second argument to a payloadCreator: { dispatch, getState, signal, rejectWithValue, extra, requestId }. signal is an AbortSignal you can pass straight to fetch() so cancellation actually cancels the HTTP request.',
    category: 'Keyword'
  },
  {
    id: 'thunk-reject-with-value',
    front: 'rejectWithValue',
    back: "return rejectWithValue(data) attaches a custom error payload to the rejected action (action.payload), instead of RTK's default action.error.message from a thrown Error , needed to preserve structured API error shapes like field-level validation.",
    category: 'Q&A'
  },
  {
    id: 'thunk-unwrap',
    front: 'unwrap()',
    back: 'dispatch(thunk()) always resolves, even on failure , it never throws by itself. Calling .unwrap() on that promise converts it back into normal throw-on-failure behaviour, so you can try/catch it like any other async call.',
    code: `try {
  await dispatch(loginUser(creds)).unwrap();
  navigate('/dashboard');
} catch (err) { setError(err.message); }`,
    category: 'Q&A'
  },
  {
    id: 'thunk-cancellation',
    front: 'Cancelling a thunk',
    back: "dispatch(thunk()) returns a promise with an .abort() method. Pass thunkAPI's signal into fetch() so the browser actually cancels the in-flight request , common in a useEffect cleanup to prevent state updates after unmount.",
    category: 'Q&A'
  }
];
