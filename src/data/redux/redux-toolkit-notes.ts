import type { Note } from '@/types/content';

export const reduxToolkitNotes: Note[] = [
  // ─── STORE ──────────────────────────────────────────────────────────────────
  {
    id: 'configure-store',
    title: 'configureStore',
    summary: "RTK's store factory , auto-combines reducers, includes thunk + dev checks, and wires up Redux DevTools.",
    difficulty: 'basic',
    category: 'store',
    prerequisites: ['redux-toolkit'],
    keyPoints: [
      'Pass an object of slice reducers; configureStore calls combineReducers automatically.',
      'Includes redux-thunk middleware by default , no separate install.',
      'Dev-mode checks: serializability check (warns on Dates, class instances) and immutability check (detects mutations).',
      'devTools: true by default , connects to Redux DevTools Extension or the embedded panel.',
      'middleware callback: (getDefault) => getDefault().concat(myMiddleware) , extend without losing defaults.',
      'preloadedState: hydrate the store from localStorage or server-side data.'
    ],
    gotcha:
      'Disabling serializability check ({ serializableCheck: false }) silences useful mutation warnings everywhere. Prefer storing plain serializable data and computing class instances in selectors instead.',
    codeSnippet: `const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: usersReducer,
  },
  middleware: (getDefault) =>
    getDefault({ serializableCheck: false }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`
  },

  // ─── SLICES ──────────────────────────────────────────────────────────────────
  {
    id: 'create-slice',
    title: 'createSlice',
    summary: 'Generates a reducer + action creators from one object , the primary way to write Redux logic in RTK.',
    difficulty: 'basic',
    category: 'slices',
    prerequisites: ['configure-store'],
    keyPoints: [
      "name sets the prefix for all action type strings (e.g., 'users/setLoading').",
      'initialState defines the starting value , can be a lazy function (() => readFromStorage()).',
      'reducers object: each key becomes both a case reducer AND an auto-generated action creator.',
      'Returns { reducer, actions, name, caseReducers, getInitialState, selectSlice }.',
      'Export actions and the default reducer from the slice file.',
      'Use extraReducers to handle actions from other slices or async thunks.'
    ],
    codeSnippet: `const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle' },
  reducers: {
    userAdded: (state, action) => {
      state.list.push(action.payload);       // Immer: OK to mutate
    },
    userRemoved: (state, action) => {
      state.list = state.list.filter(u => u.id !== action.payload);
    }
  }
});

export const { userAdded, userRemoved } = usersSlice.actions;
export default usersSlice.reducer;`
  },

  // ─── IMMER ──────────────────────────────────────────────────────────────────
  {
    id: 'immer-integration',
    title: 'Immer Integration',
    summary: 'createSlice wraps reducers with Immer , you write "mutating" code and Immer produces immutable state updates automatically.',
    difficulty: 'intermediate',
    category: 'immer',
    prerequisites: ['create-slice'],
    textbookDef:
      'Immer creates a structural Proxy (draft) of the current state. You mutate the draft freely; Immer tracks every change and produces a new immutable object at the end. If nothing changed, it returns the original reference unchanged.',
    keyPoints: [
      'Write state.value++ inside a reducer , Immer translates it to an immutable update.',
      'You can EITHER mutate the draft OR return a new value , never both from the same reducer.',
      'Returning undefined means "keep existing state"; returning null explicitly sets state to null.',
      'Immer cannot proxy primitives , if initialState is a number/string, you must return a new value.',
      'Nested mutations work: state.user.address.city = "NYC" , no deep spreading needed.'
    ],
    gotcha:
      'Accidentally returning a mutated draft AND a new value is a runtime error. The most common mistake: return state.items.push(item) , Array.push returns a number, not the array. Either mutate in place ({ state.items.push(x) }) OR return a new array (return [...state.items, x]).',
    codeSnippet: `// ❌ Wrong: push returns a number, not the array
addItem: (state, action) => return state.items.push(action.payload)

// ✅ Option 1: mutate the draft (Immer handles immutability)
addItem: (state, action) => { state.items.push(action.payload); }

// ✅ Option 2: return a brand-new value
addItem: (state, action) => ({
  ...state,
  items: [...state.items, action.payload]
})`
  },

  {
    id: 'extra-reducers',
    title: 'extraReducers',
    summary: 'Lets a slice respond to actions defined elsewhere , used for async thunk lifecycle actions and cross-slice reactions.',
    difficulty: 'intermediate',
    category: 'slices',
    prerequisites: ['create-slice'],
    textbookDef:
      'While reducers generates both reducers AND new action creators, extraReducers only adds case handlers without generating action types. It uses the builder pattern for type-safe action matching.',
    keyPoints: [
      'builder.addCase(actionCreator, reducer) , handles a specific action type.',
      'builder.addMatcher(matchFn, reducer) , matches many actions by predicate (e.g., all "fulfilled" thunks).',
      'builder.addDefaultCase(reducer) , catch-all for unmatched actions.',
      'All three createAsyncThunk lifecycle actions (pending / fulfilled / rejected) are handled here.',
      'If reducers and extraReducers define the same action type, the reducers field wins.'
    ],
    codeSnippet: `const usersSlice = createSlice({
  name: 'users',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (state) => { state.status = 'loading'; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected,  (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});`
  },

  // ─── UTILITIES ──────────────────────────────────────────────────────────────
  {
    id: 'entity-adapter',
    title: 'createEntityAdapter',
    summary: 'Generates a normalized { ids, entities } state shape plus CRUD reducers and pre-built selectors for collections.',
    difficulty: 'advanced',
    category: 'utilities',
    prerequisites: ['create-slice', 'normalized-state'],
    textbookDef:
      'createEntityAdapter provides a standardized way to store collections in a normalized lookup structure. It removes the need to manually implement ID-keyed dictionaries, CRUD operations, and sorted order maintenance.',
    keyPoints: [
      'Returns an adapter with: addOne, addMany, setAll, updateOne, removeOne, upsertOne (and Many variants).',
      'getInitialState() returns { ids: [], entities: {} } , use as initialState in createSlice.',
      'getSelectors((state) => state.sliceName) produces selectAll, selectById, selectIds, selectTotal.',
      'sortComparer option keeps entities sorted automatically on every update.',
      'updateOne takes { id, changes } , merges changes into the existing entity.'
    ],
    codeSnippet: `const adapter = createEntityAdapter<User>({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

const usersSlice = createSlice({
  name: 'users',
  initialState: adapter.getInitialState({ status: 'idle' }),
  reducers: {
    userAdded: adapter.addOne,
    usersLoaded: adapter.setAll,
  }
});

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  adapter.getSelectors((state: RootState) => state.users);`
  },

  {
    id: 'rtk-typescript',
    title: 'TypeScript Setup (RootState & AppDispatch)',
    summary: 'Infer RootState and AppDispatch from the store for fully-typed hooks across the whole app.',
    difficulty: 'intermediate',
    category: 'utilities',
    prerequisites: ['configure-store'],
    keyPoints: [
      'RootState = ReturnType<typeof store.getState> , auto-updates when slices are added/removed.',
      'AppDispatch = typeof store.dispatch , carries thunk type information.',
      'Create typed hooks: useAppDispatch and useAppSelector , use these instead of raw hooks everywhere.',
      'PayloadAction<T> from RTK types action.payload inside case reducers.',
      'Slice state type is inferred from initialState; add explicit type for complex/recursive types.'
    ],
    codeSnippet: `// store.ts
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// In components:
const count = useAppSelector(state => state.counter.value);
const dispatch = useAppDispatch();`
  },

  // ─── MIDDLEWARE ─────────────────────────────────────────────────────────────
  {
    id: 'listener-middleware',
    title: 'createListenerMiddleware',
    summary:
      "RTK's lightweight alternative to redux-saga/redux-observable , reacts to actions or state changes and runs side effects without generators.",
    difficulty: 'advanced',
    category: 'middleware',
    prerequisites: ['configure-store', 'async-thunk-basics'],
    keyPoints: [
      'createListenerMiddleware() creates one middleware instance; register handlers on it with startListening({ actionCreator | type | matcher | predicate, effect }).',
      'The effect receives (action, listenerApi) , listenerApi carries dispatch, getState, getOriginalState (the state before the triggering action), plus async helpers.',
      "listenerApi.condition(predicate) pauses the effect until a later action/state matches the predicate , the tool that replaces most of what a saga's take/put effects were used for.",
      'listenerApi.fork(fn) spawns a cancellable child task inside the effect, and cancelActiveListeners() stops other running instances of the same listener , the debounce/takeLatest equivalent.',
      'Register it before the defaults so it can observe every action: middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware).',
      'Reach for it instead of a thunk when the side effect needs to react to MULTIPLE different actions, or needs to be cancelled/superseded , a single simple async call is usually still simpler as a plain thunk.'
    ],
    gotcha:
      "Forgetting .prepend() and using .concat() instead still works, but the listener then runs after the default middleware , usually fine, but it means the listener sees an action after other middleware (like RTK Query's) has already processed it.",
    codeSnippet: `const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  actionCreator: todoAdded,
  effect: async (action, listenerApi) => {
    listenerApi.cancelActiveListeners(); // supersede any in-flight run
    await listenerApi.condition((_, state) => state.todos.syncing === false);
    listenerApi.dispatch(syncTodos());
  }
});

configureStore({
  reducer,
  middleware: (getDefault) => getDefault().prepend(listenerMiddleware.middleware)
});`
  }
];
