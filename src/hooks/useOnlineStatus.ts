'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - ONLINE STATUS ||============================== //

/**
 * Tracks the browser's network connectivity. Seeds from `navigator.onLine`
 * (guarded for SSR) and stays in sync via the window `online` / `offline`
 * events. Use it to show offline banners or pause network work.
 */
export default function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
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
