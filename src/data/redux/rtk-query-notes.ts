import type { Note } from '@/types/content';

export const rtkQueryNotes: Note[] = [
  // ─── SETUP ──────────────────────────────────────────────────────────────────
  {
    id: 'create-api',
    title: 'createApi & fetchBaseQuery',
    summary: 'createApi defines your entire API surface in one place; fetchBaseQuery is a thin fetch wrapper for the baseQuery.',
    difficulty: 'basic',
    category: 'setup',
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
  }
];
