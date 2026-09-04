import { describe, expect, it } from 'vitest';
import { hikePercentFromNewCtc, newCtcFromHike, projectionRows, scenarioRows } from './hike-calculator';

describe('newCtcFromHike', () => {
  it('applies a percentage hike to the current CTC', () => {
    expect(newCtcFromHike(1000000, 7)).toBeCloseTo(1070000, 5);
  });

  it('returns the current CTC unchanged for a 0% hike', () => {
    expect(newCtcFromHike(500000, 0)).toBe(500000);
  });
});

describe('hikePercentFromNewCtc', () => {
  it('derives the hike percentage from current and new CTC', () => {
    expect(hikePercentFromNewCtc(600000, 720000)).toBeCloseTo(20, 5);
  });

  it('returns 0 when new CTC equals current CTC', () => {
    expect(hikePercentFromNewCtc(500000, 500000)).toBe(0);
  });
});

describe('scenarioRows', () => {
  it('returns effective-10, effective, effective+10 with their resulting new CTC', () => {
    const rows = scenarioRows(1000000, 30);
    expect(rows).toEqual([
      { percent: 20, newCtc: 1200000 },
      { percent: 30, newCtc: 1300000 },
      { percent: 40, newCtc: 1400000 }
    ]);
  });
});

describe('projectionRows', () => {
  it('compounds the same percentage across 4 rows (Year 0..3)', () => {
    const rows = projectionRows(1000000, 10);
    expect(rows).toEqual([
      { year: 0, ctc: 1000000 },
      { year: 1, ctc: 1100000 },
      { year: 2, ctc: 1210000 },
      { year: 3, ctc: 1331000 }
    ]);
  });
});
