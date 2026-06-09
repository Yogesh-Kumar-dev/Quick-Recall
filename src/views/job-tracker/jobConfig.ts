// types
import type { JobSource, WorkMode } from 'types/job-tracker';

// ==============================|| JOB TRACKER - FIELD CONFIG ||============================== //

// Work mode → label, for the drawer select and the card chip.
export const WORK_MODE_CONFIG: Record<WorkMode, { label: string }> = {
  remote: { label: 'Remote' },
  hybrid: { label: 'Hybrid' },
  onsite: { label: 'On-site' }
};

export const WORK_MODE_ORDER: WorkMode[] = ['remote', 'hybrid', 'onsite'];

// Where the lead came from.
export const JOB_SOURCE_CONFIG: Record<JobSource, { label: string }> = {
  linkedin: { label: 'LinkedIn' },
  naukri: { label: 'Naukri' },
  indeed: { label: 'Indeed' },
  referral: { label: 'Referral' },
  company: { label: 'Company site' },
  other: { label: 'Other' }
};

export const JOB_SOURCE_ORDER: JobSource[] = ['linkedin', 'naukri', 'indeed', 'referral', 'company', 'other'];

// An application is "stale" if it was applied this many days ago (or earlier) and
// has had no movement beyond the 'applied' status.
export const STALE_DAYS = 14;
