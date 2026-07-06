'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - ONLINE STATUS ||============================== //

/**
 * Tracks the browser's network connectivity. Seeds from `navigator.onLine`
 * (guarded for SSR) and stays in sync via the window `online` / `offline`
 * events. Use it to show offline banners or pause network work.
 */
export default function useOnlineStatus(): boolean {
  // Always seeds `true` (matching what SSR renders, since there's no `navigator` server-side) and
  // corrects to the real value in the effect below — reading `navigator.onLine` synchronously in
  // the initializer would mismatch the server-rendered output whenever the client is actually
  // offline on first load, causing a hydration error.
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
