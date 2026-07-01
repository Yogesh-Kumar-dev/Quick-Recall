'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - FETCH ||============================== //

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Declarative data fetching for a URL. Re-runs whenever `url` changes, aborts
 * the in-flight request on cleanup (so a fast re-render or unmount can't set
 * state from a stale response), and surfaces { data, loading, error }.
 */
export default function useFetch<T = unknown>(url: string, options?: RequestInit): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: true, error: null });

  // biome-ignore lint/correctness/useExhaustiveDependencies: options is intentionally omitted — callers rarely memoise it; key on url
  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetch(url, { ...options, signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json() as Promise<T>;
      })
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          setState({ data: null, loading: false, error });
        }
      });

    return () => controller.abort();
  }, [url]);

  return state;
}
