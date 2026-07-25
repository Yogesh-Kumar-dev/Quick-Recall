'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { onForegroundMessage } from '@/lib/firebase-client';

// Background pushes show via the service worker; while the tab is focused, browsers suppress
// that handler, so this listener toasts the quote instead (mirrors src/notifications/manager.ts's
// fireSnackbar pattern rather than introducing a second notification system).
export default function PushForegroundListener() {
  useEffect(() => {
    const unsubscribe = onForegroundMessage(({ title, body }) => {
      toast(title ?? 'QuickRecall', { description: body });
    });
    return unsubscribe;
  }, []);

  return null;
}
