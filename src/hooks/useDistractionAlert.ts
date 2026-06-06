'use client';

import { useEffect, useRef } from 'react';

// ==============================|| HOOKS - DISTRACTION ALERT ||============================== //

export interface DistractionStep {
  title: string;
  body: string;
}

export interface DistractionAlertOptions {
  /** Seconds between each escalating reminder. Default: 300 (5 min) */
  interval?: number;
  /**
   * Ordered list of messages to fire, one per interval. The first fires after
   * `interval`s away, the second after 2×, and so on. Once the list is
   * exhausted we give up and fire nothing more. Default: 3 escalating nudges
   * (5, 10, 15 min) then silence after 20 min.
   */
  steps?: DistractionStep[];
}

// Escalating nudges — friendly → insistent → last call, then we give up.
const DEFAULT_STEPS: DistractionStep[] = [
  {
    title: 'Hey, still studying? 📚',
    body: "You've been away for a bit — hop back and keep the momentum going!"
  },
  {
    title: 'Your streak is waiting ⏳',
    body: "10 minutes gone. Don't let the momentum slip — come finish what you started."
  },
  {
    title: 'Come back now! 🔥',
    body: '15 minutes away. Future-you is counting on present-you. Get back in here!'
  }
];

export default function useDistractionAlert({ interval = 300, steps = DEFAULT_STEPS }: DistractionAlertOptions = {}) {
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeNotifRef = useRef<Notification | null>(null);

  // Keep the latest steps/interval available to the away-handler without
  // re-subscribing the visibility/blur listeners on every render.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const intervalRef = useRef(interval);
  intervalRef.current = interval;

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
        scheduleEscalation();
      } else {
        clearTimers();
        dismiss();
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Window blur / focus — fires when the user alt-tabs to another app
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBlur = () => {
      scheduleEscalation();
    };
    const onFocus = () => {
      clearTimers();
      dismiss();
    };

    window.addEventListener('blur', onBlur);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
      clearTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Queue one notification per step at increasing offsets (interval, 2×, 3×…).
  // After the final step we stop — no notification fires once the user has been
  // away past the last interval, so we stop nagging entirely.
  function scheduleEscalation() {
    clearTimers(); // guard against double-scheduling (e.g. blur + visibility)

    stepsRef.current.forEach((step, i) => {
      const t = setTimeout(() => fire(step), intervalRef.current * 1000 * (i + 1));
      timersRef.current.push(t);
    });
  }

  function fire(step: DistractionStep) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    // Replace any previous nudge so only the latest (most aggressive) shows.
    dismiss();

    const n = new Notification(step.title, {
      body: step.body,
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

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function dismiss() {
    if (activeNotifRef.current) {
      activeNotifRef.current.close();
      activeNotifRef.current = null;
    }
  }
}
