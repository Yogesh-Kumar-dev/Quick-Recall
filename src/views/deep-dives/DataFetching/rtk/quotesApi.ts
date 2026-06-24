// RTK Query API slice for the dummyjson quotes endpoint, using a custom axios
// baseQuery (see axiosBaseQuery.ts) instead of fetchBaseQuery. createApi
// auto-generates the useGetQuotesQuery hook from the endpoint name.
import { createApi } from '@reduxjs/toolkit/query/react';

import { PAGE_SIZE, QUOTES_BASE_URL, type QuotesResponse } from '../shared';
import { axiosBaseQuery } from './axiosBaseQuery';

export const quotesApi = createApi({
  reducerPath: 'quotesApi',
  baseQuery: axiosBaseQuery({ baseUrl: QUOTES_BASE_URL }),
  endpoints: (builder) => ({
    // arg is the 0-based page; skip is derived from it. The arg is part of the
    // cache key, so each page gets its own cache entry.
    getQuotes: builder.query<QuotesResponse, number>({
      query: (page) => ({
        url: '/quotes',
        method: 'get',
        params: { limit: PAGE_SIZE, skip: page * PAGE_SIZE }
      })
    })
  })
});

export const { useGetQuotesQuery } = quotesApi;
