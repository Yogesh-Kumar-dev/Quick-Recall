import type { Annotation } from 'types/content';

// Teaching copy of the real RTK Query demo (axiosBaseQuery.ts + quotesApi.ts +
// QuotesDemo.tsx + store wiring) flattened into one readable file. Line numbers
// in `annotations` refer to THIS string.
export const rtkCode = `import axios from 'axios';
import { useState } from 'react';
import { createApi } from '@reduxjs/toolkit/query/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const PAGE_SIZE = 6;

// Custom axios baseQuery — replaces the built-in fetchBaseQuery (which uses
// the native fetch). Return { data } on success or { error } on failure.
const axiosBaseQuery = ({ baseUrl }) => async ({ url, method, params }) => {
  try {
    const res = await axios({ url: baseUrl + url, method, params });
    return { data: res.data };
  } catch (e) {
    return { error: { status: e.response?.status, data: e.response?.data } };
  }
};

export const quotesApi = createApi({
  reducerPath: 'quotesApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'https://dummyjson.com' }),
  endpoints: (builder) => ({
    getQuotes: builder.query({
      query: (page) => ({
        url: '/quotes',
        method: 'get',
        params: { limit: PAGE_SIZE, skip: page * PAGE_SIZE }
      })
    })
  })
});

export const { useGetQuotesQuery } = quotesApi;

function QuotesDemo() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isFetching, isError, refetch } = useGetQuotesQuery(page);
  // ...render list, Prev/Next, error+retry
}

// Store — both reducer AND middleware are required.
configureStore({
  reducer: { [quotesApi.reducerPath]: quotesApi.reducer },
  middleware: (getDefault) => getDefault().concat(quotesApi.middleware)
});
`;

export const rtkAnnotations: Annotation[] = [
  {
    lines: [11, 18],
    title: 'Custom axios baseQuery',
    body: 'RTK Query ships fetchBaseQuery (native fetch). To match the TanStack variant we supply a custom baseQuery built on axios. A baseQuery is just a function returning { data } or { error } — RTK Query handles the rest.'
  },
  {
    lines: [21, 21],
    title: 'reducerPath = cache location',
    body: "The slice of Redux state where this API's cache lives. Here it's state.quotesApi. RTK Query's cache IS part of your Redux store, unlike TanStack's separate QueryClient."
  },
  {
    lines: [24, 24],
    title: 'Endpoint → auto-generated hook',
    body: 'Defining getQuotes auto-generates useGetQuotesQuery (use + PascalCase(name) + Query). No manual hook wiring — the hook name is derived from the endpoint name.'
  },
  {
    lines: [25, 29],
    title: 'arg is the cache key',
    body: 'The query arg (page) is part of the cache key, so each page is a separate cache entry — same idea as TanStack’s queryKey, just keyed by the argument you pass the hook.'
  },
  {
    lines: [38, 38],
    title: 'isLoading vs isFetching',
    body: 'isLoading is true only on the first request for an arg with no cached data. isFetching is true for any in-flight request, including background page changes — mirror of TanStack’s isPending/isFetching.'
  },
  {
    lines: [43, 46],
    title: 'Middleware is REQUIRED (the gotcha)',
    body: 'You must add api.reducer AND api.middleware to the store. Forgetting the middleware silently breaks caching, invalidation, and refetching — the most common RTK Query setup mistake. (This is why the demo uses a page-local store: middleware can’t be injected after configureStore runs.)'
  }
];
