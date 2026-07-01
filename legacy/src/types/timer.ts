// ==============================|| UNIVERSAL TIMER - TYPES ||============================== //

export type TimerMode = 'countdown' | 'pomodoro';
// Free-text — the modal offers suggestions but the user can type anything.
export type TimerPurpose = string;
export type TimerPhase = 'focus' | 'break';
export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroConfig {
  focusMinutes: number;
  breakMinutes: number;
  cycles: number; // total focus blocks before auto-stop
}

export interface TimerState {
  status: TimerStatus;
  mode: TimerMode;
  label: string;
  purpose: TimerPurpose;
  phase: TimerPhase; // always 'focus' for plain countdown
  totalSeconds: number; // duration of the CURRENT phase
  remainingSeconds: number;
  pomodoro: PomodoroConfig | null;
  currentCycle: number; // 1-based; pomodoro only
  startedAt: number | null; // epoch ms of the current phase start, for drift correction
}

// Payload to start a timer (from the config modal).
export interface StartTimerInput {
  mode: TimerMode;
  label: string;
  purpose: TimerPurpose;
  totalSeconds: number; // first-phase duration (focus for pomodoro)
  pomodoro?: PomodoroConfig | null;
}
