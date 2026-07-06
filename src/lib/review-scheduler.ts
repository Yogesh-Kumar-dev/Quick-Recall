// ==============================|| REVIEW SCHEDULER (pure) ||============================== //

// SM-2-inspired spaced repetition, retuned for SHORT interview-prep timeframes (days, not
// months). Pure and framework-free so it's trivially unit-testable — no Dexie, no React, no
// Date.now() hidden inside (the caller passes `now`).
//
// Two differences from textbook SM-2, both deliberate for this use case:
//  1. Intervals are in MINUTES, so the four buttons diverge from the very first review
//     (Again 1m / Hard 10m / Good 1d / Easy 3d) instead of all collapsing to "1 day".
//  2. Intervals are capped (~2 weeks) so even a well-known card always comes back before a
//     typical interview — nothing falls off your radar.

import type { ReviewQuality, ReviewState } from '@/types/study';

const MS_PER_MIN = 60 * 1000;
const MIN = 1;
const TEN_MIN = 10;
const ONE_DAY = 24 * 60; // 1440
const THREE_DAYS = 3 * ONE_DAY; // 4320
const MAX_INTERVAL = 14 * ONE_DAY; // ~2 weeks cap
const MIN_EASINESS = 1.3;

// Per-rating ease nudge (how the gap multiplier drifts on each pass). Again resets the card.
const EASE_DELTA: Record<ReviewQuality, number> = {
  again: -0.2,
  hard: -0.15,
  good: 0,
  easy: 0.15
};

const clampInterval = (minutes: number): number => Math.min(MAX_INTERVAL, Math.round(minutes));

// Fresh scheduling state for a newly enrolled card: due immediately so it shows up right away.
export function initialReviewState(refId: string, now: number): ReviewState {
  return {
    id: `flashcard:${refId}`,
    refId,
    easiness: 2.5,
    intervalMinutes: 0,
    repetitions: 0,
    dueAt: now,
    lastReviewedAt: 0
  };
}

export function review(state: ReviewState, quality: ReviewQuality, now: number): ReviewState {
  // Adjust ease, floored, so repeated "hard" slowly shrinks gaps and "easy" grows them.
  const nextEasiness = Math.max(MIN_EASINESS, state.easiness + EASE_DELTA[quality]);

  // Tolerate cards enrolled before the minutes migration (they lack `intervalMinutes`); treat a
  // missing value as a fresh/learning card.
  const currentInterval = state.intervalMinutes ?? 0;

  // A card is still "learning" until it has graduated past its first day-scale interval.
  const isLearning = currentInterval < ONE_DAY;

  let repetitions: number;
  let intervalMinutes: number;

  if (quality === 'again') {
    // Lapse: re-drill this session.
    repetitions = 0;
    intervalMinutes = MIN;
  } else if (quality === 'hard') {
    if (isLearning) {
      // Keep it in this session — short same-day re-look.
      repetitions = state.repetitions; // no graduation credit
      intervalMinutes = TEN_MIN;
    } else {
      // Graduated card answered with difficulty: grow only slightly.
      repetitions = state.repetitions + 1;
      intervalMinutes = clampInterval(currentInterval * 1.2);
    }
  } else if (quality === 'good') {
    repetitions = state.repetitions + 1;
    // First clean pass graduates to 1 day; afterwards multiply by ease.
    intervalMinutes = isLearning ? ONE_DAY : clampInterval(currentInterval * nextEasiness);
  } else {
    // easy
    repetitions = state.repetitions + 1;
    // First easy pass jumps to 3 days; afterwards a bigger multiplier than "good".
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

// Short label for the rating buttons ("1m", "10m", "1d", "3d") — minutes in, compact out.
export function formatInterval(intervalMinutes: number): string {
  if (intervalMinutes < 1) return '<1m';
  if (intervalMinutes < 60) return `${Math.round(intervalMinutes)}m`;
  if (intervalMinutes < ONE_DAY) return `${Math.round(intervalMinutes / 60)}h`;
  return `${Math.round(intervalMinutes / ONE_DAY)}d`;
}

// A longer, friendlier phrasing for the post-rating confirmation toast ("back in 3 days").
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
