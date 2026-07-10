'use client';

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTimerStore } from '@/stores/timer';
import { configureManager, dismissCategory, notify, requestPermission } from './manager';
import { getPrefs, type NotificationPrefs, setPrefs, subscribePrefs } from './prefs';
import type { NotificationCategory, NotificationPolicyContext, NotifyRequest } from './types';

// ==============================|| NOTIFICATIONS - REACT BINDING ||============================== //

// Thin glue between the framework-agnostic manager and React: wires a live policy-context
// getter into the manager once so feature code can call `useNotify().notify(...)`.

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const timerStatus = useTimerStore((s) => s.status);
  const timerActive = timerStatus === 'running' || timerStatus === 'paused';

  // Ref so the manager (called from anywhere, async) always reads the current value
  // without re-configuring on every change.
  const ctxRef = useRef<NotificationPolicyContext>({ timerActive });
  ctxRef.current = { timerActive };

  useEffect(() => {
    configureManager({ getPolicyContext: () => ctxRef.current });
  }, []);

  return <>{children}</>;
}

// Hook for components/hooks that raise notifications.
export function useNotify() {
  const fire = useCallback((req: NotifyRequest) => notify(req), []);
  const dismiss = useCallback((category: NotificationCategory) => dismissCategory(category), []);
  const request = useCallback(() => requestPermission(), []);
  return { notify: fire, dismissCategory: dismiss, requestPermission: request };
}

// Subscribes to cross-tab pref changes so every tab's UI stays in sync.
export function useNotificationPrefs(): [NotificationPrefs, (next: NotificationPrefs) => void] {
  const [prefs, setLocal] = useState<NotificationPrefs>(() => getPrefs());

  useEffect(() => subscribePrefs(setLocal), []);

  const update = useCallback((next: NotificationPrefs) => {
    setPrefs(next);
  }, []);

  return [prefs, update];
}
