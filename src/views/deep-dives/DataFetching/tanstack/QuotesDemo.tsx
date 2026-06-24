'use client';

import { useState } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import QuoteListView from '../QuoteListView';
import { fetchQuotes } from './quotes.api';

// Live paginated quote list powered by TanStack Query (axios under the hood).
export default function TanstackQuotesDemo() {
  const [page, setPage] = useState(0);

  const { data, isPending, isFetching, isError, refetch } = useQuery({
    queryKey: ['quotes', page],
    queryFn: () => fetchQuotes(page),
    // Keep showing the previous page's data while the next page loads —
    // prevents a blank flash on Prev/Next.
    placeholderData: keepPreviousData,
    staleTime: 30_000
  });

  return (
    <QuoteListView
      quotes={data?.quotes}
      total={data?.total}
      page={page}
      // isPending is true only on the very first load (no cached/placeholder data).
      isInitialLoading={isPending}
      isFetching={isFetching}
      isError={isError}
      onPrev={() => setPage((p) => Math.max(0, p - 1))}
      onNext={() => setPage((p) => p + 1)}
      onRetry={() => refetch()}
    />
  );
}
