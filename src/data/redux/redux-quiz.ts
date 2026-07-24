import type { QuizQuestion } from '@/types/content';

// ─── Redux quiz — multiple choice (core Redux + Redux Toolkit + RTK Query + thunks) ──

export const reduxQuiz: QuizQuestion[] = [
  {
    id: 'redux-q-three-principles',
    question: 'Which of these is NOT one of the three core principles of Redux?',
    options: ['Single source of truth', 'State is read-only', 'Changes are made with pure functions', 'Every component must be a class component'],
    correctIndex: 3,
    explanation: 'Redux is UI-library-agnostic — it has no requirement about component style.',
    category: 'Core'
  },
  {
    id: 'redux-q-reducer-purity',
    question: 'What is required of a Redux reducer?',
    options: [
      'It may perform API calls as long as it eventually returns state',
      'It must be a pure function: deterministic, no side effects, returns a new state object',
      'It must be an async function',
      'It must mutate the existing state object directly'
    ],
    correctIndex: 1,
    explanation: 'Reducers must be pure — side effects (API calls, timers) belong in middleware, not reducers.',
    category: 'Core'
  },
  {
    id: 'redux-q-code-reducer',
    question: 'What is wrong with this reducer?',
    code: `function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      state.push(action.payload);
      return state;
    default:
      return state;
  }
}`,
    options: [
      'Nothing — this is a valid Redux reducer',
      'It mutates the existing state array directly instead of returning a new one',
      'It is missing a default export',
      'switch statements are not allowed in reducers'
    ],
    correctIndex: 1,
    explanation: 'Plain Redux reducers must never mutate state in place — always return a new array/object (createSlice is the exception, via Immer).',
    category: 'Core'
  },
  {
    id: 'redux-q-dispatch',
    question: 'What is the only way to trigger a state change in a Redux store?',
    options: ['Calling store.setState() directly', 'Dispatching an action via store.dispatch(action)', 'Mutating the state object returned by getState()', 'Calling the reducer function directly'],
    correctIndex: 1,
    explanation: 'dispatch(action) sends the action through any middleware to the reducers, producing new state and notifying subscribers.',
    category: 'Core'
  },
  {
    id: 'redux-q-async-plain',
    question: 'Why can\'t plain Redux (no middleware) handle asynchronous logic directly in action creators?',
    options: [
      'Action creators must return a plain object, and dispatch only understands plain action objects',
      'JavaScript does not support async/await',
      'The store only accepts one dispatch call per second',
      'Reducers run before actions are created'
    ],
    correctIndex: 0,
    explanation: 'Middleware like redux-thunk is what allows an action creator to return a function instead of a plain object, enabling async flows.',
    category: 'Async'
  },
  {
    id: 'redux-q-thunk',
    question: 'A redux-thunk action creator returns:',
    options: ['A plain object with a type field', 'A function that receives (dispatch, getState)', 'A Promise directly', 'A generator function'],
    correctIndex: 1,
    explanation: 'The thunk middleware intercepts function-returning action creators and calls them with dispatch/getState instead of passing them to reducers.',
    category: 'Async'
  },
  {
    id: 'redux-q-selector',
    question: 'A "selector" in Redux is:',
    options: [
      'A component that dispatches actions',
      'A pure function that reads/derives data from store state',
      'A special type of reducer',
      'A CSS selector used to style connected components'
    ],
    correctIndex: 1,
    explanation: 'Selectors centralize state access, e.g. `(state) => state.user.email`.',
    category: 'Core'
  },
  {
    id: 'redux-q-reselect',
    question: 'The main benefit of `createSelector` (from Reselect / RTK) over a plain selector function is:',
    options: [
      'It automatically dispatches actions',
      'It caches its result and only recomputes when its input selectors change by reference',
      'It replaces the need for a store entirely',
      'It converts async selectors into sync ones'
    ],
    correctIndex: 1,
    explanation: 'Memoized selectors avoid expensive recalculation and prevent needless re-renders when unrelated state changes.',
    category: 'Performance'
  },
  {
    id: 'redux-q-useselector-rerender',
    question: 'When does a component using `useSelector(selector)` re-render?',
    options: [
      'On every dispatched action, regardless of the selected value',
      'Only when the selected value changes, compared by strict equality (===) by default',
      'Only when the component itself calls setState',
      'Never — useSelector only reads state once on mount'
    ],
    correctIndex: 1,
    explanation: 'react-redux compares the new selected value to the old one with === (or a custom equality function) before triggering a re-render.',
    category: 'React integration'
  },
  {
    id: 'redux-q-configurestore',
    question: 'Compared to the classic `createStore`, what does Redux Toolkit\'s `configureStore` add by default?',
    options: [
      'Nothing — they are identical',
      'redux-thunk middleware and Redux DevTools wiring, plus dev-mode serializability/immutability checks',
      'Automatic server-side rendering support',
      'It removes the need for reducers entirely'
    ],
    correctIndex: 1,
    explanation: 'configureStore is the modern, batteries-included way to set up a store with sensible defaults.',
    category: 'Redux Toolkit'
  },
  {
    id: 'redux-q-createslice',
    question: 'What does `createSlice` generate for you?',
    options: [
      'Only the reducer function',
      'Both a reducer AND its matching action creators, from one object of reducer functions',
      'Only the initial state',
      'A fully configured store'
    ],
    correctIndex: 1,
    explanation: 'Each key in the `reducers` object becomes both a case handler and an auto-generated action creator.',
    category: 'Redux Toolkit'
  },
  {
    id: 'redux-q-code-immer',
    question: 'Why is this valid inside a `createSlice` reducer, even though it looks like a mutation?',
    code: `reducers: {
  increment(state) {
    state.value += 1;
  }
}`,
    options: [
      'It is not actually valid — this will silently fail',
      'createSlice wraps reducers with Immer, which turns "mutations" on a draft into a real immutable update',
      'Redux Toolkit disabled immutability rules entirely',
      'state.value is not really part of the Redux store'
    ],
    correctIndex: 1,
    explanation: 'Immer lets you write mutating-looking code against a draft proxy; behind the scenes it produces a properly immutable next state.',
    category: 'Redux Toolkit'
  },
  {
    id: 'redux-q-extrareducers',
    question: 'When would you use `extraReducers` inside `createSlice`?',
    options: [
      'To add more initial state fields',
      'To respond to actions defined outside this slice — e.g. another slice\'s action, or a thunk\'s pending/fulfilled/rejected',
      'To replace the reducers object entirely',
      'To dispatch actions automatically on mount'
    ],
    correctIndex: 1,
    explanation: 'Unlike `reducers`, `extraReducers` does not generate new action creators — it only listens for existing ones.',
    category: 'Redux Toolkit'
  },
  {
    id: 'redux-q-createasyncthunk',
    question: '`createAsyncThunk` automatically dispatches which action types around the async payload creator?',
    options: ['start / end', 'pending / fulfilled / rejected', 'loading / success / error only if you write them manually', 'request / response'],
    correctIndex: 1,
    explanation: 'dispatch(myThunk()) fires "pending" immediately, then "fulfilled" (with the return value) or "rejected" (on throw).',
    category: 'Async'
  },
  {
    id: 'redux-q-code-unwrap',
    question: 'Why is `.unwrap()` used here?',
    code: `try {
  await dispatch(loginUser(creds)).unwrap();
  navigate('/dashboard');
} catch (err) {
  setError(err.message);
}`,
    options: [
      'dispatch(thunk()) always resolves even on failure — unwrap() converts it back to normal throw-on-failure behavior',
      'unwrap() is required to serialize the payload',
      'It converts the thunk into a synchronous function',
      'It is purely optional and has no functional effect'
    ],
    correctIndex: 0,
    explanation: 'Without unwrap(), the promise from dispatch() never rejects, so try/catch would never catch a failed login.',
    category: 'Async'
  },
  {
    id: 'redux-q-rejectwithvalue',
    question: 'What does `rejectWithValue(data)` do inside a `createAsyncThunk` payload creator?',
    options: [
      'Cancels the entire thunk silently',
      'Attaches a custom error payload to the rejected action instead of the default error.message',
      'Retries the thunk automatically',
      'Converts the rejection into a fulfilled action'
    ],
    correctIndex: 1,
    explanation: 'This is needed to preserve structured API error shapes (e.g. field-level validation errors) on rejection.',
    category: 'Async'
  },
  {
    id: 'redux-q-entity-adapter',
    question: 'What does `createEntityAdapter` provide?',
    options: [
      'A way to connect to a REST API automatically',
      'A normalized { ids, entities } state shape plus ready-made CRUD reducers and selectors for a collection',
      'A replacement for the whole Redux store',
      'Automatic TypeScript type generation from your backend schema'
    ],
    correctIndex: 1,
    explanation: 'It automates the common "normalize a list into ids + entities" pattern, with selectors like selectAll/selectById included.',
    category: 'Redux Toolkit'
  },
  {
    id: 'redux-q-rtk-query-tags',
    question: 'In RTK Query, how does a mutation trigger a related query to refetch?',
    options: [
      'You must manually call refetch() after every mutation',
      'Queries declare providesTags; matching mutations declare invalidatesTags, and RTK Query auto-refetches the overlap',
      'It happens automatically for every query, regardless of relation',
      'RTK Query has no concept of cache invalidation'
    ],
    correctIndex: 1,
    explanation: 'This tag-based system is RTK Query\'s core cache-invalidation mechanism.',
    category: 'RTK Query'
  },
  {
    id: 'redux-q-rtk-query-loading-flags',
    question: 'In an RTK Query hook result, what is the difference between `isLoading` and `isFetching`?',
    options: [
      'They are aliases for the same thing',
      'isLoading is true only on the very first load; isFetching is true on any in-flight request, including background refetches',
      'isFetching only applies to mutations',
      'isLoading never becomes false again once true'
    ],
    correctIndex: 1,
    explanation: 'During a background refetch, `data` still holds the last successful result while `isFetching` is true and `isLoading` stays false.',
    category: 'RTK Query'
  },
  {
    id: 'redux-q-normalization',
    question: 'Why normalize Redux state for collections into `{ ids: [], entities: {} }` instead of a plain array?',
    options: [
      'Arrays are not serializable in Redux',
      'It gives O(1) lookups/updates by id, removes duplication, and lets slices update independently',
      'It automatically syncs with the backend',
      'It is required by React — arrays cannot be used as props'
    ],
    correctIndex: 1,
    explanation: 'Normalized state avoids scanning arrays for updates and prevents the same entity from being duplicated across different parts of the tree.',
    category: 'Patterns'
  },
  {
    id: 'redux-q-combinereducers',
    question: 'What does `combineReducers` do?',
    options: [
      'Runs multiple reducers in parallel threads',
      'Merges multiple slice reducers into one root reducer, each managing its own state subtree',
      'Combines multiple stores into one',
      'Converts async reducers into sync ones'
    ],
    correctIndex: 1,
    explanation: 'Each slice reducer only ever sees and updates its own piece of the overall state tree.',
    category: 'Core'
  },
  {
    id: 'redux-q-provider',
    question: 'What is the purpose of react-redux\'s `<Provider store={store}>`?',
    options: [
      'It replaces the need for a Redux store',
      'It makes the store available to the whole React tree via context, so hooks like useSelector can read from it',
      'It automatically persists state to localStorage',
      'It only works with class components'
    ],
    correctIndex: 1,
    explanation: 'Without wrapping the app in Provider, useSelector/useDispatch have no store to connect to.',
    category: 'React integration'
  }
];
