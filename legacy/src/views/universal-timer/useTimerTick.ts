'use client';

import { useEffect, useRef } from 'react';

// project imports
import { useDispatch, useSelector } from 'store';
import { advancePhase, completeTimer, setRemaining } from 'store/slices/timer';
import { useNotify } from 'notifications/NotificationProvider';

// ==============================|| UNIVERSAL TIMER - TICK DRIVER ||============================== //

// Mounted once (in TimerSection). Drives the per-second countdown using
// wall-clock elapsed time (drift-corrected — background tabs throttle setInterval),
// and fires notifications on phase transitions / completion.

export default function useTimerTick() {
  const dispatch = useDispatch();
  const { notify } = useNotify();

  const status = useSelector((s) => s.timer?.status);
  const mode = useSelector((s) => s.timer?.mode);
  const phase = useSelector((s) => s.timer?.phase);
  const label = useSelector((s) => s.timer?.label);
  const purpose = useSelector((s) => s.timer?.purpose);
  const totalSeconds = useSelector((s) => s.timer?.totalSeconds);
  const startedAt = useSelector((s) => s.timer?.startedAt);
  const currentCycle = useSelector((s) => s.timer?.currentCycle);
  const pomodoroCycles = useSelector((s) => s.timer?.pomodoro?.cycles);

  // Latest values for the interval callback without re-subscribing each tick.
  const latest = useRef({ mode, phase, label, purpose, totalSeconds, startedAt, currentCycle, pomodoroCycles });
  latest.current = { mode, phase, label, purpose, totalSeconds, startedAt, currentCycle, pomodoroCycles };

  useEffect(() => {
    if (status !== 'running') return;

    const evaluate = () => {
      const {
        mode: m,
        phase: ph,
        label: lbl,
        purpose: pp,
        totalSeconds: total,
        startedAt: start,
        currentCycle: cycle,
        pomodoroCycles: cycles
      } = latest.current;
      if (!start || total == null) return;

      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = total - elapsed;

      if (remaining > 0) {
        dispatch(setRemaining(remaining));
        return;
      }

      // Phase finished. Prefer the label, then the (free-text) purpose, then a generic fallback.
      const name = lbl || pp || 'Timer';

      if (m === 'pomodoro') {
        const isLastBreak = ph === 'break' && (cycle ?? 1) >= (cycles ?? 1);
        if (isLastBreak) {
          dispatch(advancePhase()); // resolves to completed
          notify({ category: 'timer', title: 'Pomodoro complete 🎉', body: `${name} — all cycles done. Nice work!` });
        } else {
          const next = ph === 'focus' ? 'Break time ☕' : 'Back to focus 🔥';
          const body = ph === 'focus' ? `${name} — take a short break.` : `${name} — next focus block.`;
          dispatch(advancePhase());
          notify({ category: 'timer', title: next, body });
        }
      } else {
        dispatch(completeTimer());
        notify({ category: 'timer', title: 'Time’s up ⏰', body: `${name} — countdown finished.` });
      }
    };

    // Evaluate immediately, then every second.
    evaluate();
    const id = setInterval(evaluate, 1000);
    return () => clearInterval(id);
    // Re-arm whenever the running phase changes (startedAt is new per phase).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, startedAt, dispatch]);
}
