import type { ComponentType } from 'react';

// assets
import { IconBook, IconCoffee, IconCode, IconClock, IconUsers } from '@tabler/icons-react';

// types
import type { TimerPurpose } from 'types/timer';

// ==============================|| UNIVERSAL TIMER - CONFIG ||============================== //

type TablerIcon = ComponentType<{ size?: string | number; stroke?: string | number }>;

// Purpose is free text — the user can type anything. These are just suggestions
// surfaced in the modal's Autocomplete and used to pick a matching icon. Each
// suggestion's `label` is what gets stored as the purpose when picked.
export const TIMER_PURPOSE_SUGGESTIONS: { label: string; icon: TablerIcon }[] = [
  { label: 'Problem solve', icon: IconCode },
  { label: 'Mock interview', icon: IconUsers },
  { label: 'Reading', icon: IconBook },
  { label: 'Break', icon: IconCoffee }
];

export const TIMER_PURPOSE_OPTIONS = TIMER_PURPOSE_SUGGESTIONS.map((s) => s.label);

// Icon for a (possibly free-text) purpose — matches a known suggestion
// case-insensitively, otherwise falls back to a generic clock.
export function purposeIcon(purpose: TimerPurpose): TablerIcon {
  const match = TIMER_PURPOSE_SUGGESTIONS.find((s) => s.label.toLowerCase() === purpose.trim().toLowerCase());
  return match ? match.icon : IconClock;
}

// Quick-pick minute presets for the countdown field.
export const COUNTDOWN_PRESETS = [5, 15, 25, 45];

// Sensible pomodoro defaults.
export const POMODORO_DEFAULTS = { focusMinutes: 25, breakMinutes: 5, cycles: 4 };

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
