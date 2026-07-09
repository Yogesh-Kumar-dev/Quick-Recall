import type { Note } from '@/types/content';

export const rtkQueryNotes: Note[] = [
  // ─── SETUP ──────────────────────────────────────────────────────────────────
  {
    id: 'create-api',
    title: 'createApi & fetchBaseQuery',
    summary: 'createApi defines your entire API surface in one place; fetchBaseQuery is a thin fetch wrapper for the baseQuery.',
    difficulty: 'basic',
    category: 'setup',
    prerequisites: ['configure-store'],
    keyPoints: [
      "reducerPath: the key under which RTK Query's cache lives in Redux state (e.g., 'postsApi').",
      "baseQuery: fetchBaseQuery({ baseUrl: '/api' }) , all endpoint URLs are relative to this.",
      'endpoints builder: define query (GET) and mutation (POST/PUT/DELETE) endpoints here.',
      'Export the auto-generated hooks , one hook per endpoint, named automatically.',
      'Add api.reducer and api.middleware to configureStore , both are required for RTK Query to work.'
    ],
    gotcha:
      'Forgetting to add api.middleware to the store silently breaks caching, invalidation, and polling. Easy to miss when adding a new API slice.',
    codeSnippet: `export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts:     builder.query<Post[], void>({ query: () => '/posts' }),
    getPostById:  builder.query<Post, number>({ query: (id) => \`/posts/\${id}\` }),
  }),
});

export const { useGetPostsQuery, useGetPostByIdQuery } = postsApi;

// store.ts — both are required
configureStore({
  reducer: { [postsApi.reducerPath]: postsApi.reducer },
  middleware: (getDefault) => getDefault().concat(postsApi.middleware),
});`
  },

  // ─── QUERIES ────────────────────────────────────────────────────────────────
  {
    id: 'query-endpoints',
    title: 'Query Endpoints & Auto-Generated Hooks',
    summary:
      'Query endpoints fetch and cache data. RTK Query auto-generates useXxxQuery hooks with isLoading, isFetching, data, and error.',
    difficulty: 'basic',
    category: 'queries',
    prerequisites: ['create-api'],
    keyPoints: [
      'Hook naming: use + PascalCase(endpointName) + Query , e.g., getPosts → useGetPostsQuery.',
      'isLoading: true only on the FIRST load (no cached data). isFetching: true on any in-flight request including re-fetches.',
      'data persists from the last successful result even while re-fetching , prevents flash of empty state.',
      'Skip a query conditionally: useGetPostByIdQuery(id, { skip: !id }).',
      'Multiple components using the same query share one request , automatic deduplication.',
      'refetch() from the hook triggers a manual re-fetch on demand.'
    ],
    codeSnippet: `function PostList() {
  const { data: posts, isLoading, isFetching, error } = useGetPostsQuery();

  if (isLoading) return <Spinner />;   // first load only
  if (error) return <Error />;

  return (
    <>
      {isFetching && <MiniSpinner />}   {/* background re-fetch indicator */}
      {posts?.map(p => <PostCard key={p.id} post={p} />)}
    </>
  );
}`
  },

  {
    id: 'transform-response',
    title: 'transformResponse & Dynamic Queries',
    summary:
      'transformResponse reshapes the raw API response before caching; query functions accept arguments for parameterized endpoints.',
    difficulty: 'intermediate',
    category: 'queries',
    prerequisites: ['query-endpoints'],
    keyPoints: [
      'query can be a string or a function: (arg) => string | { url, params, headers, body }.',
      'transformResponse: (rawResult) => shaped , runs after fetch, before caching. Ideal for unwrapping { data: [...] }.',
      'params object in the query config is serialized as a query string automatically.',
      'The query arg is part of the cache key , different args = separate cache entries.',
      'transformErrorResponse normalizes error shapes into a consistent structure.'
    ],
    codeSnippet: `getUsers: builder.query<User[], { page: number; limit: number }>({
  query: ({ page, limit }) => ({
    url: '/users',
    params: { page, limit },     // → /users?page=1&limit=10
  }),
  transformResponse: (res: { data: User[]; total: number }) => res.data,
}),`
  },

  // ─── MUTATIONS ──────────────────────────────────────────────────────────────
  {
    id: 'mutation-endpoints',
    title: 'Mutation Endpoints & Hooks',
    summary: 'Mutation endpoints write data to the server. The hook returns a [triggerFn, status] tuple , call triggerFn with arguments.',
    difficulty: 'basic',
    category: 'mutations',
    prerequisites: ['create-api'],
    keyPoints: [
      'Hook naming: use + PascalCase(endpointName) + Mutation , e.g., addPost → useAddPostMutation.',
      'Returns [triggerFn, { isLoading, isSuccess, isError, data, reset }].',
      'triggerFn returns a promise , use .unwrap() to get the payload or throw on error.',
      "Mutations don't cache their result by default , they update other caches via tag invalidation.",
      "Define HTTP method and body: query: (data) => ({ url: '/posts', method: 'POST', body: data })."
    ],
    gotcha:
      'Each mutation call is independent , no deduplication. If the user double-clicks, two requests fire. Disable the button while isLoading to prevent duplicate submissions.',
    codeSnippet: `const [addPost, { isLoading }] = useAddPostMutation();

async function handleSubmit(data: NewPost) {
  try {
    await addPost(data).unwrap();
    toast.success('Post created!');
  } catch (err) {
    toast.error(err.data?.message ?? 'Failed');
  }
}`
  },

  // ─── CACHING ────────────────────────────────────────────────────────────────
  {
    id: 'cache-tags',
    title: 'Cache Tags (providesTags & invalidatesTags)',
    summary: 'Tags link queries to mutations , when a mutation invalidates a tag, every query providing that tag automatically refetches.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['query-endpoints', 'mutation-endpoints'],
    textbookDef:
      "Tags are string labels attached to cached query results (providesTags) and mutation effects (invalidatesTags). When a mutation's invalidatesTags overlaps any query's providesTags, those queries are marked stale and refetched.",
    keyPoints: [
      'providesTags on a query: declares what this cache entry represents.',
      'invalidatesTags on a mutation: declares what becomes stale after the mutation runs.',
      "Granular tags: [{ type: 'Post', id }] , only the specific item refetches, not the entire list.",
      "List tag pattern: provide both item tags AND a collective 'Post' tag so new items trigger list refetch.",
      'tagTypes must be declared upfront in createApi to get TypeScript safety.'
    ],
    codeSnippet: `getPosts: builder.query({
  query: () => '/posts',
  providesTags: (result) =>
    result
      ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), 'Post']
      : ['Post'],
}),
deletePost: builder.mutation({
  query: (id) => ({ url: \`/posts/\${id}\`, method: 'DELETE' }),
  invalidatesTags: (_, __, id) => [{ type: 'Post', id }, 'Post'],
}),`
  },

  {
    id: 'cache-lifecycle',
    title: 'Cache Lifecycle & keepUnusedDataFor',
    summary:
      'RTK Query counts active subscribers per cache entry. Data persists 60s after the last subscriber unmounts, then is garbage-collected.',
    difficulty: 'intermediate',
    category: 'caching',
    prerequisites: ['query-endpoints'],
    textbookDef:
      'Each unique endpoint+arg combination is one cache entry. RTK Query counts mounted components using it. When the count reaches zero, a timer starts; after keepUnusedDataFor seconds the entry is removed from state.',
    keyPoints: [
      'Default keepUnusedDataFor: 60 seconds globally; override per endpoint.',
      'refetchOnMountOrArgChange: true , always refetch on mount. A number = refetch only if data is older than N seconds.',
      'refetchOnFocus / refetchOnReconnect require setupListeners(store.dispatch) to be called once.',
      'No normalized cache , same entity from two different endpoints lives as two separate cache entries.',
      'selectFromResult reduces re-renders by picking specific fields from a cache entry.'
    ],
    codeSnippet: `// Global default
createApi({
  keepUnusedDataFor: 300,   // 5 minutes
  ...
});

// Per-endpoint override
getUser: builder.query({
  query: (id) => \`/users/\${id}\`,
  keepUnusedDataFor: 0,    // never cache — always fresh
}),

// Enable refetch on tab focus / reconnect
setupListeners(store.dispatch);`
  },

  // ─── ADVANCED USAGE ─────────────────────────────────────────────────────────
  {
    id: 'optimistic-updates',
    title: 'Optimistic Updates (onQueryStarted)',
    summary: 'Patch the cache immediately when a mutation starts, before the server responds, and roll back automatically if it fails.',
    difficulty: 'advanced',
    category: 'mutations',
    prerequisites: ['mutation-endpoints', 'cache-tags'],
    textbookDef:
      'onQueryStarted is a lifecycle callback that runs as soon as a query or mutation is dispatched, before the request resolves. Combined with api.util.updateQueryData, it lets you write an immediate, optimistic patch to an existing cache entry and undo that exact patch if the underlying request later fails.',
    keyPoints: [
      'onQueryStarted(arg, { dispatch, queryFulfilled }) runs immediately when the mutation fires, not when it resolves.',
      'dispatch(api.util.updateQueryData("getPost", id, (draft) => { ... })) mutates a cached query result in place (it\'s Immer-powered, same "mutate the draft" style as createSlice) and returns a patchResult.',
      'await queryFulfilled then either resolves (the real request succeeded, so the optimistic patch was correct and nothing more is needed) or throws.',
      'On failure, calling patchResult.undo() reverts exactly the change that was applied , the UI snaps back to its pre-optimistic state.',
      'The trade-off versus waiting for the real response: the UI feels instant, but a failed request now means visibly undoing something the user already saw succeed , only worth it for actions that rarely fail (toggling a like, reordering a list).'
    ],
    gotcha:
      'Forgetting to call patchResult.undo() in the catch path leaves the cache permanently showing the optimistic (wrong) value if the request actually failed , always pair the optimistic patch with its rollback.',
    codeSnippet: `updatePost: builder.mutation<Post, { id: number; title: string }>({
  query: ({ id, ...patch }) => ({ url: \`/posts/\${id}\`, method: 'PATCH', body: patch }),
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      postsApi.util.updateQueryData('getPostById', id, (draft) => {
        Object.assign(draft, patch); // optimistic: apply immediately
      })
    );
    try {
      await queryFulfilled; // wait for the real request
    } catch {
      patchResult.undo();   // request failed — revert the optimistic change
    }
  }
})`
  },
  {
    id: 'polling',
    title: 'Polling',
    summary: 'Re-run a query on an interval to approximate real-time data, with an option to pause while the tab is unfocused.',
    difficulty: 'intermediate',
    category: 'queries',
    prerequisites: ['query-endpoints'],
    keyPoints: [
      'Pass pollingInterval (milliseconds) as a hook option , the query automatically re-fetches on that interval for as long as the component stays mounted.',
      'skipPollingIfUnfocused: true pauses polling while the browser tab or window loses focus, resuming when it regains it , requires setupListeners(store.dispatch) to be called once so RTK Query can detect focus changes.',
      'Polling stops automatically when the component unmounts (the subscriber count drops to zero), same lifecycle as any other query subscription.',
      'The interval can be changed dynamically by re-rendering with a different pollingInterval value, letting you speed up/slow down polling based on app state.',
      'Polling is a simple approximation of real-time data , for genuinely live updates, a WebSocket-based cache update is more efficient than repeatedly re-fetching.'
    ],
    codeSnippet: `const { data } = useGetOrderStatusQuery(orderId, {
  pollingInterval: 3000,        // refetch every 3 seconds
  skipPollingIfUnfocused: true  // pause while the tab isn't focused
});`
  },
  {
    id: 'lazy-queries',
    title: 'Lazy Queries',
    summary: 'A query hook that does NOT fetch on mount , you call a trigger function to start it manually.',
    difficulty: 'intermediate',
    category: 'queries',
    prerequisites: ['query-endpoints'],
    keyPoints: [
      'useLazyGetXQuery() (the "Lazy" + endpoint name + Query pattern) returns a [trigger, result, lastPromiseInfo] tuple instead of fetching immediately like useGetXQuery does.',
      "Nothing happens until you call trigger(arg) , the request fires at that point, and result updates just like a normal query hook's return value.",
      'Ideal for fetch-on-demand patterns: search-as-you-type (fire on each keystroke, debounced), a query that should only run after a button click, or a value needed only inside an event handler rather than during render.',
      'The cache behaviour is identical to a regular query once triggered , same deduplication, same cache tags, same subscription lifecycle.',
      'Don\'t reach for a lazy query just to "control timing" when a plain useGetXQuery(arg, { skip }) would do , skip is simpler when the query should still run automatically once its precondition becomes true.'
    ],
    codeSnippet: `const [triggerSearch, { data, isFetching }] = useLazySearchPostsQuery();

function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  triggerSearch(e.target.value); // fires only when called, not on mount
}`
  }
];
