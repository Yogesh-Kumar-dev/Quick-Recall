'use client';

import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';

// project imports
import { useDispatch, useSelector } from 'store';
import { configureManager, dismissCategory, notify, requestPermission } from './manager';
import { getPrefs, setPrefs, subscribePrefs } from './prefs';

// types
import type { NotificationCategory, NotificationPolicyContext, NotifyRequest } from './types';
import type { NotificationPrefs } from './prefs';

// ==============================|| NOTIFICATIONS - REACT BINDING ||============================== //

// Thin glue between the framework-agnostic manager and React/Redux. Wires the
// snackbar `dispatch` and a live policy-context getter into the manager once, so
// feature code can call `useNotify().notify(...)` without touching either.

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();

  // Read the live timer status for the suppression rule. Defensive `?.` because
  // the slice is registered statically but selectors stay null-safe regardless.
  const timerStatus = useSelector((s) => s.timer?.status);
  const timerActive = timerStatus === 'running' || timerStatus === 'paused';

  // Keep the policy context in a ref so the manager (called from anywhere, async)
  // always reads the current value without us re-configuring on every change.
  const ctxRef = useRef<NotificationPolicyContext>({ timerActive });
  ctxRef.current = { timerActive };

  useEffect(() => {
    configureManager({ dispatch, getPolicyContext: () => ctxRef.current });
  }, [dispatch]);

  return <>{children}</>;
}

// Hook for components/hooks that raise notifications.
export function useNotify() {
  const fire = useCallback((req: NotifyRequest) => notify(req), []);
  const dismiss = useCallback((category: NotificationCategory) => dismissCategory(category), []);
  const request = useCallback(() => requestPermission(), []);
  return { notify: fire, dismissCategory: dismiss, requestPermission: request };
}

// Hook for the preferences UI (e.g. the ProfileSection toggle). Subscribes to
// cross-tab pref changes so every tab's UI stays in sync.
export function useNotificationPrefs(): [NotificationPrefs, (next: NotificationPrefs) => void] {
  const [prefs, setLocal] = useState<NotificationPrefs>(() => getPrefs());

  useEffect(() => subscribePrefs(setLocal), []);

  const update = useCallback((next: NotificationPrefs) => {
    setPrefs(next); // persists + notifies subscribers (including this hook)
  }, []);

  return [prefs, update];
}
