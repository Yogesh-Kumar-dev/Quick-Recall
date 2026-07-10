import type { InterviewOutcome, JobSource, JobStatus, WorkMode } from '@/types/job-tracker';

// ==============================|| JOB TRACKER - CONFIG ||============================== //

// `border` = left accent on cards; `colBorder` = bottom accent on board columns. Both are
// literal classes (not built at runtime) so Tailwind's scanner emits them.
export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; badgeClass: string; border: string; colBorder: string }> = {
  applied: {
    label: 'Applied',
    badgeClass: 'border-blue-500/40 text-blue-400',
    border: 'border-l-blue-500',
    colBorder: 'border-b-blue-500'
  },
  interviewing: {
    label: 'Interviewing',
    badgeClass: 'border-amber-500/40 text-amber-400',
    border: 'border-l-amber-500',
    colBorder: 'border-b-amber-500'
  },
  offer: {
    label: 'Offer',
    badgeClass: 'border-emerald-500/40 text-emerald-400',
    border: 'border-l-emerald-500',
    colBorder: 'border-b-emerald-500'
  },
  rejected: { label: 'Rejected', badgeClass: 'border-red-500/40 text-red-400', border: 'border-l-red-500', colBorder: 'border-b-red-500' },
  ghosted: {
    label: 'Ghosted',
    badgeClass: 'border-gray-500/40 text-gray-400',
    border: 'border-l-gray-500',
    colBorder: 'border-b-gray-500'
  },
  fake: {
    label: 'Fake',
    badgeClass: 'border-purple-500/40 text-purple-400',
    border: 'border-l-purple-500',
    colBorder: 'border-b-purple-500'
  }
};

export const JOB_STATUS_ORDER: JobStatus[] = ['applied', 'interviewing', 'offer', 'rejected', 'ghosted', 'fake'];

export const INTERVIEW_OUTCOME_CONFIG: Record<InterviewOutcome, { label: string; textClass: string }> = {
  pending: { label: 'Pending', textClass: 'text-muted-foreground' },
  passed: { label: 'Passed', textClass: 'text-emerald-400' },
  failed: { label: 'Failed', textClass: 'text-red-400' }
};

export const INTERVIEW_OUTCOME_ORDER: InterviewOutcome[] = ['pending', 'passed', 'failed'];

export const INTERVIEW_ROUND_NAME_OPTIONS: string[] = [
  'Phone screen',
  'Recruiter call',
  'Online assessment',
  'Technical',
  'Coding round',
  'System design',
  'Take-home assignment',
  'Pair programming',
  'Hiring manager',
  'Behavioral',
  'Team / culture fit',
  'HR round'
];

export const WORK_MODE_CONFIG: Record<WorkMode, { label: string }> = {
  remote: { label: 'Remote' },
  hybrid: { label: 'Hybrid' },
  onsite: { label: 'On-site' }
};

export const WORK_MODE_ORDER: WorkMode[] = ['remote', 'hybrid', 'onsite'];

export const JOB_SOURCE_CONFIG: Record<JobSource, { label: string }> = {
  linkedin: { label: 'LinkedIn' },
  naukri: { label: 'Naukri' },
  indeed: { label: 'Indeed' },
  referral: { label: 'Referral' },
  company: { label: 'Company site' },
  other: { label: 'Other' }
};

export const JOB_SOURCE_ORDER: JobSource[] = ['linkedin', 'naukri', 'indeed', 'referral', 'company', 'other'];

// stale = applied this many days ago (or earlier) with no movement beyond 'applied'
export const STALE_DAYS = 14;
