'use client';

import { type ReactNode, useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { quotesApi } from './rtk/quotesApi';

// Page-scoped providers for the data-fetching demo. We deliberately do NOT
// touch the global app store: RTK Query needs its middleware registered at
// configureStore time, and the global store fixes its middleware up front
// (and uses runtime reducer injection). So this demo spins up its own isolated
// Redux store (quotesApi reducer + middleware) and its own QueryClient. Nothing
// leaks into the global store, and the demo is fully self-contained.
export default function DemoProviders({ children }: { children: ReactNode }) {
  // useState initializers so the store / client are created once per mount,
  // not on every render.
  const [demoStore] = useState(() =>
    configureStore({
      reducer: { [quotesApi.reducerPath]: quotesApi.reducer },
      // Required — omitting api.middleware silently breaks caching/refetching.
      middleware: (getDefault) => getDefault().concat(quotesApi.middleware)
    })
  );
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Provider store={demoStore}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
