import type { Annotation } from 'types/content';

// The implementation shown in the annotated viewer. This is a teaching copy of
// the real TanStack demo (quotes.api.ts + QuotesDemo.tsx) flattened into one
// readable file. Line numbers in `annotations` below refer to THIS string.
export const tanstackCode = `import axios from 'axios';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

const PAGE_SIZE = 6;
const client = axios.create({ baseURL: 'https://dummyjson.com' });

// queryFn just returns a promise — TanStack doesn't care how you fetch.
async function fetchQuotes(page) {
  const res = await client.get('/quotes', {
    params: { limit: PAGE_SIZE, skip: page * PAGE_SIZE }
  });
  return res.data;
}

function QuotesDemo() {
  const [page, setPage] = useState(0);

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['quotes', page],
    queryFn: () => fetchQuotes(page),
    placeholderData: keepPreviousData,
    staleTime: 30_000
  });

  if (isPending) return <Skeletons />;
  if (isError) return <Error onRetry={refetch} />;

  return <QuoteList data={data} isFetching={isFetching} />;
}

// Provider — created once, near the app root (here: page-scoped).
// <QueryClientProvider client={new QueryClient()}>...</QueryClientProvider>
`;

export const tanstackAnnotations: Annotation[] = [
  {
    lines: [6, 6],
    title: 'Bring your own transport',
    body: 'TanStack Query has no opinion on how you fetch. Here we use an axios instance — the same transport the RTK Query variant uses — so the only real difference is the caching wrapper, not the network call.'
  },
  {
    lines: [9, 14],
    title: 'queryFn returns a promise',
    body: 'The query function just needs to return a promise that resolves to your data (or throws on error). axios rejects on non-2xx, which TanStack turns into the error state automatically.'
  },
  {
    lines: [19, 19],
    title: 'isPending vs isFetching',
    body: 'isPending is true only on the FIRST load with no data yet (show a skeleton). isFetching is true for ANY in-flight request, including background page changes (show a subtle indicator while keeping the old data).'
  },
  {
    lines: [20, 20],
    title: 'queryKey = cache identity',
    body: "['quotes', page] uniquely identifies this cache entry. Change page and TanStack treats it as a different entry — caching each page separately and refetching only when it sees a key it hasn't fetched."
  },
  {
    lines: [22, 22],
    title: 'keepPreviousData — no blank flash',
    body: 'While the next page loads, the previous page stays on screen instead of unmounting to a loading state. This is what makes Prev/Next feel smooth.'
  },
  {
    lines: [23, 23],
    title: 'staleTime',
    body: 'For 30s the cached data is considered fresh — revisiting a page within that window serves the cache with no network request. After that it refetches in the background.'
  },
  {
    lines: [37, 38],
    title: 'One QueryClient at the root',
    body: 'A single QueryClient (wrapped in QueryClientProvider) holds the cache for the whole tree. The cache lives outside Redux — it is TanStack’s own store.'
  }
];
