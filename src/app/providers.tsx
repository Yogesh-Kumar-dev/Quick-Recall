'use client';

import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import type { ReactNode } from 'react';

// App is dark-only (MongoDB design). LeafyGreen manages its own dark mode via context; the shadcn /
// Tailwind side is dark via the static tokens in globals.css. More providers (nuqs, sonner) get
// added here as their phases land.
export default function Providers({ children }: { children: ReactNode }) {
  return <LeafyGreenProvider darkMode>{children}</LeafyGreenProvider>;
}
