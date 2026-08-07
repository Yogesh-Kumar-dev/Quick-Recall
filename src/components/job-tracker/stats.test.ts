import { describe, expect, it } from 'vitest';

import type { JobApplication } from '@/types/job-tracker';
import { deriveStats, formatSalary, isActive, isStale, upcomingRoundCount } from './stats';

const DAY_MS = 24 * 60 * 60 * 1000;
const STALE_DAYS = 14;

function makeJob(overrides: Partial<JobApplication> = {}): JobApplication {
  return {
    id: '1',
    companyName: 'Test',
    jobTitle: 'Dev',
    status: 'applied',
    appliedAt: new Date(Date.now() - 20 * DAY_MS).toISOString(),
    favorite: false,
    rounds: [],
    contacts: [],
    documents: [],
    notes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...overrides
  };
}

describe('isActive', () => {
  it('returns true for applied', () => {
    expect(isActive(makeJob({ status: 'applied' }))).toBe(true);
  });

  it('returns true for interviewing', () => {
    expect(isActive(makeJob({ status: 'interviewing' }))).toBe(true);
  });

  it('returns true for offer', () => {
    expect(isActive(makeJob({ status: 'offer' }))).toBe(true);
  });

  it('returns false for rejected', () => {
    expect(isActive(makeJob({ status: 'rejected' }))).toBe(false);
  });

  it('returns false for ghosted', () => {
    expect(isActive(makeJob({ status: 'ghosted' }))).toBe(false);
  });

  it('returns false for fake', () => {
    expect(isActive(makeJob({ status: 'fake' }))).toBe(false);
  });
});

describe('isStale', () => {
  const now = 1_000_000_000_000;

  it('returns true when applied > STALE_DAYS ago and status is applied', () => {
    const job = makeJob({
      status: 'applied',
      appliedAt: new Date(now - (STALE_DAYS + 1) * DAY_MS).toISOString()
    });
    expect(isStale(job, now)).toBe(true);
  });

  it('returns false when applied < STALE_DAYS ago', () => {
    const job = makeJob({
      status: 'applied',
      appliedAt: new Date(now - (STALE_DAYS - 1) * DAY_MS).toISOString()
    });
    expect(isStale(job, now)).toBe(false);
  });

  it('returns false when status is not applied', () => {
    const job = makeJob({
      status: 'interviewing',
      appliedAt: new Date(now - (STALE_DAYS + 5) * DAY_MS).toISOString()
    });
    expect(isStale(job, now)).toBe(false);
  });

  it('returns false when appliedAt is missing', () => {
    const job = makeJob({ status: 'applied', appliedAt: undefined as unknown as string });
    expect(isStale(job, now)).toBe(false);
  });

  it('returns false when appliedAt is invalid', () => {
    const job = makeJob({ status: 'applied', appliedAt: 'not-a-date' });
    expect(isStale(job, now)).toBe(false);
  });
});

describe('upcomingRoundCount', () => {
  const now = 1_000_000_000_000;

  it('counts rounds with at >= now', () => {
    const jobs = [
      makeJob({
        rounds: [
          { id: 'r1', at: new Date(now + 1000).toISOString(), outcome: 'pending' },
          { id: 'r2', at: new Date(now - 1000).toISOString(), outcome: 'passed' }
        ]
      })
    ];
    expect(upcomingRoundCount(jobs, now)).toBe(1);
  });

  it('returns 0 for jobs with no rounds', () => {
    expect(upcomingRoundCount([makeJob()], 0)).toBe(0);
  });

  it('returns 0 for empty input', () => {
    expect(upcomingRoundCount([], 0)).toBe(0);
  });
});

describe('deriveStats', () => {
  const now = 1_000_000_000_000;

  it('returns zeros for empty input', () => {
    const stats = deriveStats([], now);
    expect(stats.total).toBe(0);
    expect(stats.active).toBe(0);
    expect(stats.stale).toBe(0);
    expect(stats.responseRate).toBe(0);
    expect(stats.offerRate).toBe(0);
  });

  it('counts statuses correctly', () => {
    const jobs = [
      makeJob({ status: 'applied' }),
      makeJob({ status: 'applied' }),
      makeJob({ status: 'interviewing' }),
      makeJob({ status: 'offer' }),
      makeJob({ status: 'rejected' })
    ];
    const stats = deriveStats(jobs, now);
    expect(stats.statusCounts.applied).toBe(2);
    expect(stats.statusCounts.interviewing).toBe(1);
    expect(stats.statusCounts.offer).toBe(1);
    expect(stats.statusCounts.rejected).toBe(1);
    expect(stats.total).toBe(5);
  });

  it('computes active count excluding closed statuses', () => {
    const jobs = [
      makeJob({ status: 'applied' }),
      makeJob({ status: 'interviewing' }),
      makeJob({ status: 'rejected' }),
      makeJob({ status: 'ghosted' })
    ];
    expect(deriveStats(jobs, now).active).toBe(2);
  });

  it('computes responseRate as % that reached interviewing+', () => {
    const jobs = [
      makeJob({ status: 'applied' }),
      makeJob({ status: 'applied' }),
      makeJob({ status: 'interviewing' }),
      makeJob({ status: 'offer' })
    ];
    expect(deriveStats(jobs, now).responseRate).toBe(50);
  });

  it('computes offerRate as % of total that are offers', () => {
    const jobs = [
      makeJob({ status: 'offer' }),
      makeJob({ status: 'applied' }),
      makeJob({ status: 'applied' }),
      makeJob({ status: 'applied' })
    ];
    expect(deriveStats(jobs, now).offerRate).toBe(25);
  });

  it('counts stale jobs', () => {
    const stale = makeJob({
      status: 'applied',
      appliedAt: new Date(now - (STALE_DAYS + 1) * DAY_MS).toISOString()
    });
    const fresh = makeJob({
      status: 'applied',
      appliedAt: new Date(now - 1 * DAY_MS).toISOString()
    });
    expect(deriveStats([stale, fresh], now).stale).toBe(1);
  });
});

describe('formatSalary', () => {
  it('returns empty string when both min and max are null', () => {
    const job = makeJob({ salaryMin: undefined, salaryMax: undefined });
    expect(formatSalary(job)).toBe('');
  });

  it('formats min only', () => {
    const job = makeJob({ salaryMin: 100000, salaryMax: undefined });
    const result = formatSalary(job);
    // toLocaleString output varies by locale — just check it contains the digits
    expect(result).toMatch(/1.*00.*000/);
  });

  it('formats max only', () => {
    const job = makeJob({ salaryMin: undefined, salaryMax: 200000 });
    const result = formatSalary(job);
    expect(result).toMatch(/2.*00.*000/);
  });

  it('formats range with currency', () => {
    const job = makeJob({ salaryMin: 100000, salaryMax: 200000, salaryCurrency: 'USD' });
    const result = formatSalary(job);
    expect(result).toMatch(/^USD /);
    expect(result).toMatch(/1.*00.*000/);
    expect(result).toMatch(/–/);
    expect(result).toMatch(/2.*00.*000/);
  });

  it('formats range without currency', () => {
    const job = makeJob({ salaryMin: 80000, salaryMax: 120000 });
    const result = formatSalary(job);
    expect(result).toMatch(/8.*000/);
    expect(result).toMatch(/–/);
    expect(result).toMatch(/1.*20.*000/);
  });
});
