import { describe, expect, it } from 'vitest';
import { hikePercentFromNewCtc, newCtcFromHike, projectionRows, scenarioRows } from './hike-calculator';

describe('newCtcFromHike', () => {
  it('applies a percentage hike to the current CTC', () => {
    expect(newCtcFromHike(1000000, 7)).toBeCloseTo(1070000, 5);
  });

  it('returns the current CTC unchanged for a 0% hike', () => {
    expect(newCtcFromHike(500000, 0)).toBe(500000);
  });

  it('round-trips a pay cut through hikePercentFromNewCtc', () => {
    const cutPercent = hikePercentFromNewCtc(1000000, 900000);
    expect(cutPercent).toBeCloseTo(-10, 5);
    expect(newCtcFromHike(1000000, cutPercent)).toBeCloseTo(900000, 5);
  });
});

describe('hikePercentFromNewCtc', () => {
  it('derives the hike percentage from current and new CTC', () => {
    expect(hikePercentFromNewCtc(600000, 720000)).toBeCloseTo(20, 5);
  });

  it('returns 0 when new CTC equals current CTC', () => {
    expect(hikePercentFromNewCtc(500000, 500000)).toBe(0);
  });

  it('returns a negative percent for a pay cut', () => {
    expect(hikePercentFromNewCtc(1000000, 900000)).toBeCloseTo(-10, 5);
  });
});

describe('scenarioRows', () => {
  it('returns effective-10, effective, effective+10 unchanged when they are already round', () => {
    const rows = scenarioRows(1000000, 30);
    expect(rows).toEqual([
      { percent: 20, newCtc: 1200000 },
      { percent: 30, newCtc: 1300000 },
      { percent: 40, newCtc: 1400000 }
    ]);
  });

  it('rounds a flank up to the nearest 10 when closer to the higher multiple', () => {
    const rows = scenarioRows(1000000, 16);
    expect(rows).toEqual([
      { percent: 10, newCtc: 1100000 }, // 6 -> 10
      { percent: 16, newCtc: 1160000 }, // middle stays exact
      { percent: 30, newCtc: 1300000 } // 26 -> 30
    ]);
  });

  it('rounds a flank down to the nearest 10 when closer to the lower multiple', () => {
    const rows = scenarioRows(1000000, 32);
    expect(rows).toEqual([
      { percent: 20, newCtc: 1200000 }, // 22 -> 20
      { percent: 32, newCtc: 1320000 }, // middle stays exact
      { percent: 40, newCtc: 1400000 } // 42 -> 40
    ]);
  });

  it('rounds a negative lower flank up to 0 instead of leaving it negative', () => {
    const rows = scenarioRows(1000000, 5);
    expect(rows[0]).toEqual({ percent: 0, newCtc: 1000000 });
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
