'use client';

import { useState } from 'react';

import QuoteListView from '../QuoteListView';
import { useGetQuotesQuery } from './quotesApi';

// Live paginated quote list powered by RTK Query (custom axios baseQuery).
export default function RtkQuotesDemo() {
  const [page, setPage] = useState(0);

  // Auto-generated hook. data persists from the last successful page while a
  // new page is in flight (isFetching), so the list doesn't blank out.
  const { data, isLoading, isFetching, isError, refetch } = useGetQuotesQuery(page);

  return (
    <QuoteListView
      quotes={data?.quotes}
      total={data?.total}
      page={page}
      // isLoading is true only on the first request for a given arg with no cached data.
      isInitialLoading={isLoading}
      isFetching={isFetching}
      isError={isError}
      onPrev={() => setPage((p) => Math.max(0, p - 1))}
      onNext={() => setPage((p) => p + 1)}
      onRetry={() => refetch()}
    />
  );
}
