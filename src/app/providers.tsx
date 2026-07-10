'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import NotificationProvider from '@/notifications/notification-provider';
import EmotionRegistry from './emotion-registry';

// SerwistProvider is disabled in dev because its install-time route warm-up would trigger a
// Turbopack recompile per route on every "download for offline" run.
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SerwistProvider swUrl="/serwist/sw.js" disable={process.env.NODE_ENV === 'development'}>
      <NuqsAdapter>
        <EmotionRegistry>
          <LeafyGreenProvider darkMode>
            <NotificationProvider>{children}</NotificationProvider>
          </LeafyGreenProvider>
          <Toaster theme="dark" richColors position="bottom-right" />
        </EmotionRegistry>
      </NuqsAdapter>
    </SerwistProvider>
  );
}
