// ==============================|| REVIEW SCHEDULER (pure) ||============================== //

// SM-2-inspired spaced repetition, retuned for SHORT interview-prep timeframes (days, not
// months). Pure/framework-free (caller passes `now`) so it's trivially unit-testable.
//
// Two deliberate deviations from textbook SM-2: intervals are in MINUTES so the four buttons
// diverge from the first review (Again 1m / Hard 10m / Good 1d / Easy 3d) instead of all
// collapsing to "1 day", and intervals are capped (~2 weeks) so nothing falls off the radar.

import type { BookmarkKind, ReviewQuality, ReviewState } from '@/types/study';

const MS_PER_MIN = 60 * 1000;
const MIN = 1;
const TEN_MIN = 10;
const ONE_DAY = 24 * 60;
const THREE_DAYS = 3 * ONE_DAY;
const MAX_INTERVAL = 14 * ONE_DAY;
const MIN_EASINESS = 1.3;

// Per-rating ease nudge; "again" resets the card via EASE_DELTA.again.
const EASE_DELTA: Record<ReviewQuality, number> = {
  again: -0.2,
  hard: -0.15,
  good: 0,
  easy: 0.15
};

const clampInterval = (minutes: number): number => Math.min(MAX_INTERVAL, Math.round(minutes));

export function initialReviewState(refId: string, now: number, kind: BookmarkKind = 'flashcard'): ReviewState {
  return {
    id: `${kind}:${refId}`,
    refId,
    easiness: 2.5,
    intervalMinutes: 0,
    repetitions: 0,
    dueAt: now,
    lastReviewedAt: 0
  };
}

export function review(state: ReviewState, quality: ReviewQuality, now: number): ReviewState {
  const nextEasiness = Math.max(MIN_EASINESS, state.easiness + EASE_DELTA[quality]);

  // `?? 0` tolerates cards enrolled before the minutes migration, which lack this field.
  const currentInterval = state.intervalMinutes ?? 0;

  // "Learning" until it graduates past its first day-scale interval.
  const isLearning = currentInterval < ONE_DAY;

  let repetitions: number;
  let intervalMinutes: number;

  if (quality === 'again') {
    repetitions = 0;
    intervalMinutes = MIN;
  } else if (quality === 'hard') {
    if (isLearning) {
      repetitions = state.repetitions; // no graduation credit
      intervalMinutes = TEN_MIN;
    } else {
      repetitions = state.repetitions + 1;
      intervalMinutes = clampInterval(currentInterval * 1.2);
    }
  } else if (quality === 'good') {
    repetitions = state.repetitions + 1;
    intervalMinutes = isLearning ? ONE_DAY : clampInterval(currentInterval * nextEasiness);
  } else {
    repetitions = state.repetitions + 1;
    intervalMinutes = isLearning ? THREE_DAYS : clampInterval(currentInterval * nextEasiness * 1.3);
  }

  return {
    ...state,
    easiness: nextEasiness,
    repetitions,
    intervalMinutes,
    dueAt: now + intervalMinutes * MS_PER_MIN,
    lastReviewedAt: now
  };
}

// Compact label for the rating buttons, e.g. "10m", "1d".
export function formatInterval(intervalMinutes: number): string {
  if (intervalMinutes < 1) return '<1m';
  if (intervalMinutes < 60) return `${Math.round(intervalMinutes)}m`;
  if (intervalMinutes < ONE_DAY) return `${Math.round(intervalMinutes / 60)}h`;
  return `${Math.round(intervalMinutes / ONE_DAY)}d`;
}

// Friendlier phrasing for the post-rating confirmation toast, e.g. "back in 3 days".
export function formatDuePhrase(intervalMinutes: number): string {
  if (intervalMinutes < 1) return 'again shortly';
  if (intervalMinutes < 60) {
    const m = Math.round(intervalMinutes);
    return `in ${m} minute${m === 1 ? '' : 's'}`;
  }
  if (intervalMinutes < ONE_DAY) {
    const h = Math.round(intervalMinutes / 60);
    return `in ${h} hour${h === 1 ? '' : 's'}`;
  }
  const d = Math.round(intervalMinutes / ONE_DAY);
  return d === 1 ? 'tomorrow' : `in ${d} days`;
}
