// Shared types + constants for both data-fetching demos. The dummyjson quotes
// endpoint returns a paginated envelope; both the TanStack and RTK Query
// variants consume the same shape so only the library wrapper differs.

export interface Quote {
  id: number;
  quote: string;
  author: string;
}

export interface QuotesResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

export const QUOTES_BASE_URL = 'https://dummyjson.com';
export const PAGE_SIZE = 6;
