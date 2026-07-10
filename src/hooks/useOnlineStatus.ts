'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - ONLINE STATUS ||============================== //

/**
 * Tracks the browser's network connectivity. Seeds from `navigator.onLine`
 * (guarded for SSR) and stays in sync via the window `online` / `offline`
 * events. Use it to show offline banners or pause network work.
 */
export default function useOnlineStatus(): boolean {
  // Seeds `true` to match SSR (no `navigator` server-side); reading the real value synchronously
  // would mismatch the server output and cause a hydration error when offline on first load.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(navigator.onLine);

    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return online;
}
