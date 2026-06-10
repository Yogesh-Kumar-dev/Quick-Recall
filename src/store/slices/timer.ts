import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// types
import type { PomodoroConfig, StartTimerInput, TimerState } from 'types/timer';

// ==============================|| SLICE - UNIVERSAL TIMER ||============================== //

const initialState: TimerState = {
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

const timer = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    startTimer(state, action: PayloadAction<StartTimerInput>) {
      const { mode, label, purpose, totalSeconds, pomodoro } = action.payload;
      state.status = 'running';
      state.mode = mode;
      state.label = label;
      state.purpose = purpose;
      state.phase = 'focus';
      state.totalSeconds = totalSeconds;
      state.remainingSeconds = totalSeconds;
      state.pomodoro = mode === 'pomodoro' ? (pomodoro ?? null) : null;
      state.currentCycle = 1;
      state.startedAt = Date.now();
    },

    // Set the remaining time directly — the tick hook computes this from wall-clock
    // elapsed time (drift-corrected) rather than blindly decrementing.
    setRemaining(state, action: PayloadAction<number>) {
      if (state.status !== 'running') return;
      state.remainingSeconds = Math.max(0, action.payload);
    },

    pauseTimer(state) {
      if (state.status === 'running') state.status = 'paused';
    },

    resumeTimer(state) {
      if (state.status === 'paused') {
        state.status = 'running';
        // Re-anchor the phase start so drift correction continues from "now".
        state.startedAt = Date.now() - (state.totalSeconds - state.remainingSeconds) * 1000;
      }
    },

    resetTimer() {
      return initialState;
    },

    completeTimer(state) {
      state.status = 'completed';
      state.remainingSeconds = 0;
      state.startedAt = null;
    },

    // Pomodoro only: move to the next phase. Returning to focus increments the
    // cycle; once we'd exceed the configured cycle count, the timer completes.
    advancePhase(state) {
      if (state.mode !== 'pomodoro' || !state.pomodoro) {
        state.status = 'completed';
        state.remainingSeconds = 0;
        state.startedAt = null;
        return;
      }
      const cfg: PomodoroConfig = state.pomodoro;
      if (state.phase === 'focus') {
        // focus → break
        state.phase = 'break';
        state.totalSeconds = cfg.breakMinutes * 60;
        state.remainingSeconds = state.totalSeconds;
        state.startedAt = Date.now();
      } else {
        // break → next focus (or complete if all cycles done)
        if (state.currentCycle >= cfg.cycles) {
          state.status = 'completed';
          state.remainingSeconds = 0;
          state.startedAt = null;
          return;
        }
        state.currentCycle += 1;
        state.phase = 'focus';
        state.totalSeconds = cfg.focusMinutes * 60;
        state.remainingSeconds = state.totalSeconds;
        state.startedAt = Date.now();
      }
    }
  }
});

export default timer.reducer;

export const { startTimer, setRemaining, pauseTimer, resumeTimer, resetTimer, completeTimer, advancePhase } = timer.actions;

export type TimerSliceState = TimerState;
export { initialState as timerInitialState };
