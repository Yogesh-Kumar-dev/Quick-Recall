'use client';

import LeafyGreenProvider from '@leafygreen-ui/leafygreen-provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import NotificationProvider from '@/notifications/notification-provider';
import EmotionRegistry from './emotion-registry';

// App is dark-only (MongoDB design). LeafyGreen manages its own dark mode via context; the shadcn /
// Tailwind side is dark via the static tokens in globals.css. EmotionRegistry flushes LeafyGreen's
// emotion styles into the SSR HTML. NotificationProvider wires the notification manager's live policy
// context (native Web Notifications + sonner fallback).
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <EmotionRegistry>
        <LeafyGreenProvider darkMode>
          <NotificationProvider>{children}</NotificationProvider>
        </LeafyGreenProvider>
        <Toaster theme="dark" richColors position="bottom-right" />
      </EmotionRegistry>
    </NuqsAdapter>
  );
}
