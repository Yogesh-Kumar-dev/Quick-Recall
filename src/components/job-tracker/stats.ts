import type { JobApplication, JobStatus } from '@/types/job-tracker';
import { STALE_DAYS } from './config';

// ==============================|| JOB TRACKER - DERIVED STATS & HELPERS ||============================== //

const DAY_MS = 24 * 60 * 60 * 1000;

// Statuses that mean the application is no longer in play.
const CLOSED_STATUSES: JobStatus[] = ['rejected', 'ghosted', 'fake'];

export function isActive(job: JobApplication): boolean {
  return !CLOSED_STATUSES.includes(job.status);
}

// Stale = still sitting in 'applied', with an applied date older than STALE_DAYS.
export function isStale(job: JobApplication, now: number = Date.now()): boolean {
  if (job.status !== 'applied') return false;
  if (!job.appliedAt) return false;
  const applied = new Date(job.appliedAt).getTime();
  if (Number.isNaN(applied)) return false;
  return now - applied >= STALE_DAYS * DAY_MS;
}

export function upcomingRoundCount(jobs: JobApplication[], now: number = Date.now()): number {
  return jobs.reduce((sum, job) => sum + (job.rounds ?? []).filter((r) => new Date(r.at).getTime() >= now).length, 0);
}

export interface JobStats {
  total: number;
  statusCounts: Record<JobStatus, number>;
  active: number;
  stale: number;
  upcoming: number;
  responseRate: number; // % of applications that reached interviewing or beyond
  offerRate: number; // % of applications that became an offer
}

// Reached interviewing or further down the funnel (offer means they got past interviews).
function reachedInterview(job: JobApplication): boolean {
  return job.status === 'interviewing' || job.status === 'offer' || (job.rounds?.length ?? 0) > 0;
}

export function deriveStats(jobs: JobApplication[], now: number = Date.now()): JobStats {
  const statusCounts = { applied: 0, interviewing: 0, offer: 0, rejected: 0, ghosted: 0, fake: 0 } as Record<JobStatus, number>;
  let active = 0;
  let stale = 0;
  let responded = 0;
  let offers = 0;

  for (const job of jobs) {
    statusCounts[job.status] += 1;
    if (isActive(job)) active += 1;
    if (isStale(job, now)) stale += 1;
    if (reachedInterview(job)) responded += 1;
    if (job.status === 'offer') offers += 1;
  }

  const total = jobs.length;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));

  return {
    total,
    statusCounts,
    active,
    stale,
    upcoming: upcomingRoundCount(jobs, now),
    responseRate: pct(responded),
    offerRate: pct(offers)
  };
}

// Format a salary range using the stored currency (defaults to a bare number).
export function formatSalary(job: JobApplication): string {
  const { salaryMin, salaryMax, salaryCurrency } = job;
  if (salaryMin == null && salaryMax == null) return '';
  const cur = salaryCurrency ? `${salaryCurrency} ` : '';
  const fmt = (n: number) => n.toLocaleString();
  if (salaryMin != null && salaryMax != null) return `${cur}${fmt(salaryMin)} – ${fmt(salaryMax)}`;
  return `${cur}${fmt((salaryMin ?? salaryMax) as number)}`;
}
