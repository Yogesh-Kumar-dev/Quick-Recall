import { describe, expect, it } from 'vitest';

import type { ReviewState } from '@/types/study';
import { formatDuePhrase, formatInterval, initialReviewState, review } from './review-scheduler';

// The scheduler is pure and takes `now` as an argument, so we pin it to 0. That makes every
// `dueAt` a plain `intervalMinutes * 60_000` — no wall clock, no flaky timing.
const NOW = 0;
const MINUTE = 60_000;
const ONE_DAY_MIN = 24 * 60;

describe('initialReviewState', () => {
  it('seeds a brand-new card as due immediately, in the learning phase', () => {
    const state = initialReviewState('css:box-model', NOW);
    expect(state).toEqual({
      id: 'flashcard:css:box-model', // default kind is flashcard
      refId: 'css:box-model',
      easiness: 2.5,
      intervalMinutes: 0,
      repetitions: 0,
      dueAt: NOW,
      lastReviewedAt: 0
    });
  });

  it('namespaces the id with the given kind', () => {
    expect(initialReviewState('two-sum', NOW, 'problem').id).toBe('problem:two-sum');
  });
});

describe('review — from a fresh (learning) card', () => {
  const fresh = initialReviewState('css:box-model', NOW);

  it('"again" resets to a 1-minute step', () => {
    const next = review(fresh, 'again', NOW);
    expect(next.intervalMinutes).toBe(1);
    expect(next.repetitions).toBe(0);
    expect(next.dueAt).toBe(NOW + 1 * MINUTE);
  });

  it('"hard" while learning gives a 10-minute step without graduation credit', () => {
    const next = review(fresh, 'hard', NOW);
    expect(next.intervalMinutes).toBe(10);
    expect(next.repetitions).toBe(fresh.repetitions); // no +1
  });

  it('"good" while learning graduates the card to 1 day', () => {
    const next = review(fresh, 'good', NOW);
    expect(next.intervalMinutes).toBe(ONE_DAY_MIN);
    expect(next.repetitions).toBe(1);
  });

  it('"easy" while learning jumps straight to 3 days', () => {
    const next = review(fresh, 'easy', NOW);
    expect(next.intervalMinutes).toBe(3 * ONE_DAY_MIN);
  });
});

describe('review — from a graduated card', () => {
  // A card that already sits above the 1-day learning threshold.
  const graduated: ReviewState = {
    id: 'flashcard:x',
    refId: 'x',
    easiness: 2.5,
    intervalMinutes: ONE_DAY_MIN, // exactly 1 day => no longer "learning"
    repetitions: 3,
    dueAt: NOW,
    lastReviewedAt: NOW
  };

  it('"good" multiplies the interval by easiness', () => {
    const next = review(graduated, 'good', NOW);
    // easiness unchanged for "good" (delta 0) => 1440 * 2.5 = 3600
    expect(next.intervalMinutes).toBe(Math.round(ONE_DAY_MIN * 2.5));
    expect(next.dueAt).toBe(NOW + next.intervalMinutes * MINUTE);
  });

  it('"easy" multiplies by easiness and an extra 1.3 bonus', () => {
    const next = review(graduated, 'easy', NOW);
    // easy bumps easiness by +0.15 first (2.65), then interval = 1440 * 2.65 * 1.3
    expect(next.easiness).toBeCloseTo(2.65);
    expect(next.intervalMinutes).toBe(Math.round(ONE_DAY_MIN * 2.65 * 1.3));
  });
});

describe('review — invariants', () => {
  it('never lets easiness drop below the 1.3 floor', () => {
    let state = initialReviewState('x', NOW);
    // Hammer the hardest ratings well past where a naive subtraction would go negative.
    for (let i = 0; i < 20; i++) state = review(state, 'again', NOW);
    expect(state.easiness).toBeGreaterThanOrEqual(1.3);
  });

  it('caps the interval at ~2 weeks even for a huge easiness/interval', () => {
    const huge: ReviewState = {
      id: 'flashcard:x',
      refId: 'x',
      easiness: 2.5,
      intervalMinutes: 10 * ONE_DAY_MIN, // 10 days; *2.5 would blow past the cap
      repetitions: 5,
      dueAt: NOW,
      lastReviewedAt: NOW
    };
    const next = review(huge, 'good', NOW);
    expect(next.intervalMinutes).toBe(14 * ONE_DAY_MIN); // MAX_INTERVAL
  });

  it('treats a legacy card missing intervalMinutes as still learning', () => {
    // Cards enrolled before the minutes migration lack this field (the `?? 0` guard).
    const { intervalMinutes: _omit, ...legacy } = initialReviewState('x', NOW);
    const next = review(legacy as ReviewState, 'good', NOW);
    expect(next.intervalMinutes).toBe(ONE_DAY_MIN); // graduated from learning, not multiplied
  });
});

describe('formatInterval', () => {
  it.each([
    [0.5, '<1m'],
    [10, '10m'],
    [90, '2h'], // 90 min rounds to 2h
    [ONE_DAY_MIN, '1d'],
    [3 * ONE_DAY_MIN, '3d']
  ])('formats %d minutes as %s', (minutes, expected) => {
    expect(formatInterval(minutes)).toBe(expected);
  });
});

describe('formatDuePhrase', () => {
  it.each([
    [0.5, 'again shortly'],
    [1, 'in 1 minute'], // singular
    [10, 'in 10 minutes'], // plural
    [120, 'in 2 hours'],
    [ONE_DAY_MIN, 'tomorrow'], // exactly 1 day is special-cased
    [3 * ONE_DAY_MIN, 'in 3 days']
  ])('phrases %d minutes as "%s"', (minutes, expected) => {
    expect(formatDuePhrase(minutes)).toBe(expected);
  });
});
