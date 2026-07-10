'use client';

import { useEffect } from 'react';
import { notify } from '@/notifications/manager';
import { useTimerStore } from '@/stores/timer';

// Drives the countdown from wall-clock elapsed time (drift-corrected — background tabs throttle
// setInterval). Reads fresh state via getState() inside the interval so one interval runs for the
// whole 'running' span — pomodoro phase changes are picked up on the next tick without re-arming.
export function useTimerTick() {
  const status = useTimerStore((s) => s.status);

  useEffect(() => {
    if (status !== 'running') return;

    const evaluate = () => {
      const s = useTimerStore.getState();
      if (s.status !== 'running' || s.startedAt == null) return;

      const remaining = s.totalSeconds - Math.floor((Date.now() - s.startedAt) / 1000);
      if (remaining > 0) {
        s.setRemaining(remaining);
        return;
      }

      const name = s.label || s.purpose || 'Timer';

      if (s.mode === 'pomodoro') {
        const isLastBreak = s.phase === 'break' && s.currentCycle >= (s.pomodoro?.cycles ?? 1);
        if (isLastBreak) {
          s.advancePhase(); // resolves to completed
          notify({ category: 'timer', title: 'Pomodoro complete', body: `${name} — all cycles done. Nice work!` });
        } else {
          const next = s.phase === 'focus' ? 'Break time' : 'Back to focus';
          const body = s.phase === 'focus' ? `${name} — take a short break.` : `${name} — next focus block.`;
          s.advancePhase();
          notify({ category: 'timer', title: next, body });
        }
      } else {
        s.complete();
        notify({ category: 'timer', title: "Time's up", body: `${name} — countdown finished.` });
      }
    };

    evaluate(); // don't wait a full second for the first update
    const id = setInterval(evaluate, 1000);
    return () => clearInterval(id);
  }, [status]);
}
