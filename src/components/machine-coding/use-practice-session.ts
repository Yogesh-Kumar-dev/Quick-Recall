'use client';

import { useEffect, useRef, useState } from 'react';

// ==============================|| PRACTICE SESSION (timer + status) ||============================== //

// idle → active (timer running, solution locked) → submitted (awaiting self-grade) → graded.
// The countdown keeps running past zero (goes negative) — like a real interview, expiry is
// pressure, not a hard stop.

export type PracticeStatus = 'idle' | 'active' | 'submitted' | 'graded';

export default function usePracticeSession() {
  const [status, setStatus] = useState<PracticeStatus>('idle');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (status !== 'active') return;
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  // `startedAt` defaults to now; resuming a persisted session passes its original start
  // time, so minutes spent on other pages still count against the clock.
  const start = (durationMin: number, startedAt: number = Date.now()) => {
    startedAtRef.current = startedAt;
    setSecondsLeft(durationMin * 60 - Math.round((Date.now() - startedAt) / 1000));
    setStatus('active');
  };

  return {
    status,
    secondsLeft,
    startedAt: startedAtRef.current,
    start,
    submit: () => setStatus('submitted'),
    markGraded: () => setStatus('graded'),
    reset: () => setStatus('idle')
  };
}

export type PracticeSession = ReturnType<typeof usePracticeSession>;
