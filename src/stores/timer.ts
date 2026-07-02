import { create } from 'zustand';

// Universal timer store (Zustand — replaces the legacy Redux slice). Countdown or
// pomodoro. The tick hook (use-timer-tick) drives remainingSeconds from wall-clock
// elapsed time rather than blind decrements, so background-tab throttling can't drift it.

export type TimerMode = 'countdown' | 'pomodoro';
export type TimerPhase = 'focus' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroConfig {
  focusMinutes: number;
  breakMinutes: number;
  cycles: number; // total focus blocks before auto-stop
}

export interface StartTimerInput {
  mode: TimerMode;
  label: string;
  purpose: string;
  totalSeconds: number; // first-phase duration (focus for pomodoro)
  pomodoro?: PomodoroConfig | null;
}

interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  label: string;
  purpose: string;
  phase: TimerPhase; // always 'focus' for plain countdown
  totalSeconds: number; // duration of the CURRENT phase
  remainingSeconds: number;
  pomodoro: PomodoroConfig | null;
  currentCycle: number; // 1-based; pomodoro only
  startedAt: number | null; // epoch ms of the current phase start, for drift correction
}

interface TimerActions {
  start: (input: StartTimerInput) => void;
  setRemaining: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  complete: () => void;
  advancePhase: () => void; // pomodoro: focus↔break, completes after the last cycle
}

const initial: TimerState = {
  status: 'idle',
  mode: 'countdown',
  label: '',
  purpose: 'problem',
  phase: 'focus',
  totalSeconds: 0,
  remainingSeconds: 0,
  pomodoro: null,
  currentCycle: 1,
  startedAt: null
};

export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  ...initial,

  start: ({ mode, label, purpose, totalSeconds, pomodoro }) =>
    set({
      status: 'running',
      mode,
      label,
      purpose,
      phase: 'focus',
      totalSeconds,
      remainingSeconds: totalSeconds,
      pomodoro: mode === 'pomodoro' ? (pomodoro ?? null) : null,
      currentCycle: 1,
      startedAt: Date.now()
    }),

  setRemaining: (seconds) => {
    if (get().status !== 'running') return;
    set({ remainingSeconds: Math.max(0, seconds) });
  },

  pause: () => {
    if (get().status === 'running') set({ status: 'paused' });
  },

  resume: () => {
    const s = get();
    if (s.status !== 'paused') return;
    // Re-anchor the phase start so drift correction continues from "now".
    set({ status: 'running', startedAt: Date.now() - (s.totalSeconds - s.remainingSeconds) * 1000 });
  },

  reset: () => set({ ...initial }),

  complete: () => set({ status: 'completed', remainingSeconds: 0, startedAt: null }),

  advancePhase: () => {
    const s = get();
    if (s.mode !== 'pomodoro' || !s.pomodoro) {
      set({ status: 'completed', remainingSeconds: 0, startedAt: null });
      return;
    }
    const cfg = s.pomodoro;
    if (s.phase === 'focus') {
      set({ phase: 'break', totalSeconds: cfg.breakMinutes * 60, remainingSeconds: cfg.breakMinutes * 60, startedAt: Date.now() });
      return;
    }
    // break → next focus, or complete once all cycles are done
    if (s.currentCycle >= cfg.cycles) {
      set({ status: 'completed', remainingSeconds: 0, startedAt: null });
      return;
    }
    set({
      currentCycle: s.currentCycle + 1,
      phase: 'focus',
      totalSeconds: cfg.focusMinutes * 60,
      remainingSeconds: cfg.focusMinutes * 60,
      startedAt: Date.now()
    });
  }
}));
