'use client';

import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import EmotionRegistry from './emotion-registry';

// App is dark-only (MongoDB design). LeafyGreen manages its own dark mode via context; the shadcn /
// Tailwind side is dark via the static tokens in globals.css. EmotionRegistry flushes LeafyGreen's
// emotion styles into the SSR HTML. More providers (sonner) get added here as their phases land.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <EmotionRegistry>
        <LeafyGreenProvider darkMode>{children}</LeafyGreenProvider>
      </EmotionRegistry>
    </NuqsAdapter>
  );
}
