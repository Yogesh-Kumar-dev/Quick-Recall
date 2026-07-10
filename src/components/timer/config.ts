import { BookOpen, Clock, Code, Coffee, type LucideIcon, Users } from 'lucide-react';

// purpose is free text — these are just chip suggestions; the chip's `label` is what gets stored
export const TIMER_PURPOSE_SUGGESTIONS: { label: string; icon: LucideIcon }[] = [
  { label: 'Problem solve', icon: Code },
  { label: 'Mock interview', icon: Users },
  { label: 'Reading', icon: BookOpen },
  { label: 'Break', icon: Coffee }
];

export function purposeIcon(purpose: string): LucideIcon {
  const match = TIMER_PURPOSE_SUGGESTIONS.find((s) => s.label.toLowerCase() === purpose.trim().toLowerCase());
  return match ? match.icon : Clock;
}

export const COUNTDOWN_PRESETS = [5, 15, 25, 45];
export const POMODORO_DEFAULTS = { focusMinutes: 25, breakMinutes: 5, cycles: 4 };

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
