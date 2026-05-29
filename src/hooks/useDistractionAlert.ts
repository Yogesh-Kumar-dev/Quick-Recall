'use client';

import { useEffect, useRef } from 'react';

// ==============================|| HOOKS - DISTRACTION ALERT ||============================== //

export interface DistractionAlertOptions {
  /** Seconds to wait after the user leaves before firing. Default: 300 (5 min) */
  delay?: number;
  title?: string;
  body?: string;
}

export default function useDistractionAlert({
  delay = 300,
  title = 'Hey, still studying?',
  body = "You've been away for a while — get back and keep the momentum going!"
}: DistractionAlertOptions = {}) {
  const tabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeNotifRef = useRef<Notification | null>(null);

  // Request permission once on mount
  useEffect(() => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      void Notification.requestPermission();
    }
  }, []);

  // Page Visibility API — fires when the user switches browser tabs
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        tabTimerRef.current = setTimeout(fire, delay * 1000);
      } else {
        clearTimer(tabTimerRef);
        dismiss();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimer(tabTimerRef);
    };
  }, [delay, title, body]); // eslint-disable-line react-hooks/exhaustive-deps

  // Window blur / focus — fires when the user alt-tabs to another app
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBlur = () => {
      windowTimerRef.current = setTimeout(fire, delay * 1000);
    };
    const onFocus = () => {
      clearTimer(windowTimerRef);
      dismiss();
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      clearTimer(windowTimerRef);
    };
  }, [delay, title, body]); // eslint-disable-line react-hooks/exhaustive-deps

  function fire() {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    if (activeNotifRef.current) return;

    const n = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'distraction-alert'
    });

    n.onclick = () => {
      window.focus();
      n.close();
      activeNotifRef.current = null;
    };
    n.onclose = () => {
      activeNotifRef.current = null;
    };

    activeNotifRef.current = n;
  }

  function clearTimer(ref: { current: ReturnType<typeof setTimeout> | null }) {
    if (ref.current !== null) {
      clearTimeout(ref.current);
      ref.current = null;
    }
  }

  function dismiss() {
    if (activeNotifRef.current) {
      activeNotifRef.current.close();
      activeNotifRef.current = null;
    }
  }
}
