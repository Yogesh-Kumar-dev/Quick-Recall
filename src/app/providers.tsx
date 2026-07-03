'use client';

import { SerwistProvider } from '@serwist/turbopack/react';
import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import NotificationProvider from '@/notifications/notification-provider';
import EmotionRegistry from './emotion-registry';

// App is dark-only (MongoDB design). LeafyGreen manages its own dark mode via context; the shadcn /
// Tailwind side is dark via the static tokens in globals.css. EmotionRegistry flushes LeafyGreen's
// emotion styles into the SSR HTML. NotificationProvider wires the notification manager's live policy
// context (native Web Notifications + sonner fallback). SerwistProvider registers the PWA service
// worker (served at /serwist/sw.js — see src/app/serwist/[path]/route.ts); disabled in dev since the
// service worker's install-time route warm-up would otherwise trigger a recompile per route on
// every "download for offline" run against Turbopack's on-demand dev compiler.
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
