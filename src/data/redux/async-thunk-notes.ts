import type { Note } from '@/types/content';

export const asyncThunkNotes: Note[] = [
  // ─── LIFECYCLE ──────────────────────────────────────────────────────────────
  {
    id: 'async-thunk-basics',
    title: 'createAsyncThunk Basics',
    summary: 'Wraps an async function and auto-dispatches pending / fulfilled / rejected actions around its execution.',
    difficulty: 'basic',
    category: 'lifecycle',
    keyPoints: [
      "First arg: a string prefix for the action types ('users/fetchAll').",
      'Second arg: the payloadCreator — an async function returning the payload or throwing on error.',
      'Dispatching the thunk returns a promise that resolves to the fulfilled or rejected action.',
      'Generates three action creators: fetchUsers.pending, fetchUsers.fulfilled, fetchUsers.rejected.',
      'Handle these lifecycle actions in extraReducers to update loading state and store data.'
    ],
    codeSnippet: `export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (page: number) => {
    const res = await fetch(\`/api/users?page=\${page}\`);
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();   // returned value → action.payload in fulfilled
  }
);

// Dispatch it anywhere
dispatch(fetchUsers(1));`
  },

  {
    id: 'thunk-lifecycle',
    title: 'Lifecycle Actions in extraReducers',
    summary: 'The three generated actions — pending, fulfilled, rejected — are handled in extraReducers to drive loading states.',
    difficulty: 'basic',
    category: 'lifecycle',
    keyPoints: [
      "pending: set status to 'loading', optionally clear previous errors.",
      'fulfilled: action.payload holds the value returned by the payloadCreator.',
      'rejected: action.error.message for thrown errors; action.payload for rejectWithValue errors.',
      "Standard pattern: status field with 'idle' | 'loading' | 'succeeded' | 'failed' values.",
      'Multiple thunks can target the same slice — each adds its own builder.addCase blocks.'
    ],
    codeSnippet: `extraReducers: (builder) => {
  builder
    .addCase(fetchUsers.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(fetchUsers.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.users = action.payload;
    })
    .addCase(fetchUsers.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message ?? 'Unknown error';
    });
}`
  },

  {
    id: 'thunk-api',
    title: 'thunkAPI — dispatch, getState & signal',
    summary: 'The second parameter to payloadCreator provides store access, an abort signal, and other utilities for advanced patterns.',
    difficulty: 'intermediate',
    category: 'lifecycle',
    textbookDef:
      'thunkAPI is an object injected by the thunk middleware into the payloadCreator. It exposes Redux store methods and abort utilities, giving the async function the full context it needs without global imports.',
    keyPoints: [
      'dispatch: dispatch other actions or thunks from inside the payloadCreator.',
      'getState: read current state mid-thunk — useful for auth tokens, conditional fetches, or combining slices.',
      'signal: an AbortSignal — pass to fetch() to cancel the HTTP request automatically when the thunk is aborted.',
      'requestId: unique ID per invocation — store it to cancel a specific in-flight request.',
      "extra: the 'extra argument' from the thunk middleware — ideal for injecting API service instances."
    ],
    codeSnippet: `export const fetchUserPosts = createAsyncThunk(
  'posts/fetchForUser',
  async (userId: string, { getState, dispatch, signal }) => {
    const { auth } = getState() as RootState;
    const res = await fetch(\`/api/users/\${userId}/posts\`, {
      headers: { Authorization: \`Bearer \${auth.token}\` },
      signal,   // fetch is cancelled automatically when thunk is aborted
    });
    return res.json();
  }
);`
  },

  // ─── ERRORS ─────────────────────────────────────────────────────────────────
  {
    id: 'reject-with-value',
    title: 'rejectWithValue & Error Handling',
    summary: 'rejectWithValue attaches a custom payload to the rejected action — critical for field-level API errors.',
    difficulty: 'intermediate',
    category: 'errors',
    textbookDef:
      'When a payloadCreator throws, RTK serializes the Error into action.error. To include richer structured data (e.g., API response body), return thunkAPI.rejectWithValue(data) — it lands in action.payload on the rejected case.',
    keyPoints: [
      'Thrown Error → action.error.message set, action.payload is undefined.',
      'return rejectWithValue(data) → action.payload = data, action.error.message = "Rejected".',
      'Check action.payload first (structured API error) then action.error.message (raw JS error).',
      'RTK auto-serializes Error objects — custom subclass properties (statusCode, etc.) are stripped. Use rejectWithValue to preserve them.',
      'Works well with field-level validation: rejectWithValue({ field: "email", message: "Already taken" }).'
    ],
    gotcha:
      'createAsyncThunk NEVER rejects its dispatch promise — even on error, dispatch(fetchX()).then() always resolves. Use .unwrap() to get promise-rejection behaviour.',
    codeSnippet: `export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await api.post('/login', credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);  // { message: 'Invalid password' }
    }
  }
);

// In reducer:
.addCase(loginUser.rejected, (state, action) => {
  state.error = (action.payload as ApiError)?.message
    ?? action.error.message;
})`
  },

  {
    id: 'unwrap',
    title: 'unwrap() — Promise-based Dispatch',
    summary: '.unwrap() converts the thunk result into a real promise — resolving with the payload or throwing with the error.',
    difficulty: 'intermediate',
    category: 'errors',
    keyPoints: [
      "dispatch(thunk()) resolves to the fulfilled/rejected action — it doesn't throw by itself.",
      '.unwrap() throws if the action was rejected — making it behave like a normal async/await function.',
      'Use unwrap() in components when you need to react to success/failure inline (toast, navigate, setError).',
      'RTK Query mutation hooks have .unwrap() too — the same pattern applies.',
      'Avoid overusing unwrap() in reducers — side effects belong in components or middleware.'
    ],
    codeSnippet: `// In a component
async function handleLogin() {
  try {
    const user = await dispatch(loginUser(credentials)).unwrap();
    navigate('/dashboard');          // only runs on success
  } catch (rejectedValue) {
    setError(rejectedValue.message); // only runs on failure
  }
}`
  },

  // ─── ADVANCED ───────────────────────────────────────────────────────────────
  {
    id: 'thunk-cancellation',
    title: 'Request Cancellation',
    summary:
      'Thunks expose an abort() method. Pass the AbortSignal to fetch to cancel the in-flight HTTP request when the thunk is aborted.',
    difficulty: 'advanced',
    category: 'advanced',
    textbookDef:
      'createAsyncThunk creates a requestAbortController per invocation. Calling promise.abort() triggers the controller — sets signal.aborted, cancels any fetch using that signal, and dispatches a rejected action with AbortError.',
    keyPoints: [
      'const promise = dispatch(fetchUsers()); promise.abort("reason") — cancels the thunk.',
      'Pass signal (from thunkAPI) to fetch() — browser cancels the actual HTTP request.',
      "Cancelled actions: action.error.name === 'AbortError'.",
      'condition option in createAsyncThunk can abort before even starting if a predicate returns false.',
      'Useful in useEffect cleanups — prevents state updates on unmounted components.'
    ],
    codeSnippet: `useEffect(() => {
  const promise = dispatch(fetchUserPosts(userId));

  return () => {
    promise.abort();  // cancel on unmount or userId change
  };
}, [userId, dispatch]);

// In payloadCreator — guard against a condition before fetch
export const fetchIfNeeded = createAsyncThunk(
  'data/fetchIfNeeded',
  async (_, thunkAPI) => { /* ... */ },
  {
    condition: (_, { getState }) => {
      const { status } = (getState() as RootState).data;
      return status !== 'loading';  // skip if already loading
    }
  }
);`
  }
];
