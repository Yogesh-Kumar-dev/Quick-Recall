'use client';

import { useEffect, useRef } from 'react';

// ==============================|| HOOKS - CROSS-TAB PRESENCE HEARTBEAT ||============================== //

// Detects whether the user is present in ANY tab of the app via a BroadcastChannel
// heartbeat. While a tab is visible/focused it broadcasts; every tab tracks when a
// sibling was last heard from. Lets a backgrounded tab know "the user is still here,
// just in another tab" so it can stay quiet instead of false-alarming.
//
// Returns `isSiblingActive(withinMs)` — true if some OTHER tab broadcast a heartbeat
// within the last `withinMs`. Falls back to always-false (current per-tab behavior)
// where BroadcastChannel is unavailable.

const CHANNEL = 'quickrecall-presence';
const HEARTBEAT_MS = 2000;

export default function usePresenceHeartbeat() {
  const lastSiblingActiveAt = useRef(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel(CHANNEL);
    channelRef.current = channel;

    channel.onmessage = (e) => {
      if (e.data?.type === 'active') lastSiblingActiveAt.current = e.data.ts ?? Date.now();
    };

    const beat = () => {
      if (typeof document !== 'undefined' && !document.hidden) {
        channel.postMessage({ type: 'active', ts: Date.now() });
      }
    };

    const onVisibility = () => {
      if (!document.hidden) beat();
    };

    // Beat immediately, on focus/visibility, and on a light interval while visible.
    beat();
    window.addEventListener('focus', beat);
    document.addEventListener('visibilitychange', onVisibility);
    const id = setInterval(beat, HEARTBEAT_MS);

    return () => {
      clearInterval(id);
      window.removeEventListener('focus', beat);
      document.removeEventListener('visibilitychange', onVisibility);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  const isSiblingActive = (withinMs: number) => Date.now() - lastSiblingActiveAt.current < withinMs;

  return { isSiblingActive };
}
