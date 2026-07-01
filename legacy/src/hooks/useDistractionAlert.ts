'use client';

import { useEffect, useRef } from 'react';

// project imports
import { useSelector } from 'store';
import { useNotify } from 'notifications/NotificationProvider';
import usePresenceHeartbeat from './usePresenceHeartbeat';

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
  const { notify, dismissCategory, requestPermission } = useNotify();
  const { isSiblingActive } = usePresenceHeartbeat();

  // A universal timer being active fully suppresses distraction nudges. The
  // notification manager's policy also blocks them, but we additionally cancel
  // pending nudges here so nothing is queued while a timer runs.
  const timerStatus = useSelector((s) => s.timer?.status);
  const timerActive = timerStatus === 'running' || timerStatus === 'paused';

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Keep the latest values available to the long-lived listeners without
  // re-subscribing them on every render.
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const intervalRef = useRef(interval);
  intervalRef.current = interval;
  const timerActiveRef = useRef(timerActive);
  timerActiveRef.current = timerActive;
  const isSiblingActiveRef = useRef(isSiblingActive);
  isSiblingActiveRef.current = isSiblingActive;

  // Request permission once on mount.
  useEffect(() => {
    void requestPermission();
  }, [requestPermission]);

  // When a universal timer becomes active, cancel any pending/visible nudge.
  useEffect(() => {
    if (timerActive) {
      clearTimers();
      dismissCategory('distraction');
    }
  }, [timerActive, dismissCategory]);

  // Page Visibility API — fires when the user switches browser tabs.
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onVisibilityChange = () => {
      if (document.hidden) {
        scheduleEscalation();
      } else {
        clearTimers();
        dismissCategory('distraction');
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      clearTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Window blur / focus — fires when the user alt-tabs to another app.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onBlur = () => {
      scheduleEscalation();
    };
    const onFocus = () => {
      clearTimers();
      dismissCategory('distraction');
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
  // After the final step we stop nagging entirely.
  function scheduleEscalation() {
    clearTimers(); // guard against double-scheduling (e.g. blur + visibility)

    // Don't schedule anything while a universal timer is running.
    if (timerActiveRef.current) return;

    stepsRef.current.forEach((step, i) => {
      const t = setTimeout(() => fire(step), intervalRef.current * 1000 * (i + 1));
      timersRef.current.push(t);
    });
  }

  function fire(step: DistractionStep) {
    // Suppress if a universal timer is active (also enforced centrally by policy).
    if (timerActiveRef.current) return;

    // Multi-tab: if the user is active in another tab of the app, they're not
    // distracted — this backgrounded tab should stay quiet. An active sibling beats
    // every ~2s, so a short freshness window (5s) reliably detects presence while
    // still firing once every tab has gone quiet.
    if (isSiblingActiveRef.current(5000)) return;

    notify({ category: 'distraction', title: step.title, body: step.body });
  }

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }
}
