// TanStack Query transport layer — plain axios. TanStack is library-agnostic
// about how you fetch; the queryFn just needs to return a promise. We use the
// same axios under the hood as the RTK Query variant so the comparison is
// apples-to-apples on the network layer.
import axios from 'axios';

import { PAGE_SIZE, QUOTES_BASE_URL, type QuotesResponse } from '../shared';

const client = axios.create({ baseURL: QUOTES_BASE_URL });

// Fetch one page (0-based) of quotes. skip is derived from the page index.
export async function fetchQuotes(page: number): Promise<QuotesResponse> {
  const res = await client.get<QuotesResponse>('/quotes', {
    params: { limit: PAGE_SIZE, skip: page * PAGE_SIZE }
  });
  return res.data;
}
