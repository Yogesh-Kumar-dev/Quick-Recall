// types
import type { JobStatus } from 'types/job-tracker';

// ==============================|| JOB TRACKER - STATUS CONFIG ||============================== //

// Single source of truth for status → label + color. Reused by the card chip,
// the filter row, and the drawer's status select so they never drift apart.

type StatusColor = 'info' | 'warning' | 'success' | 'error' | 'secondary' | 'default';

export const JOB_STATUS_CONFIG: Record<JobStatus, { label: string; color: StatusColor }> = {
  applied: { label: 'Applied', color: 'info' },
  interviewing: { label: 'Interviewing', color: 'warning' },
  offer: { label: 'Offer', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
  ghosted: { label: 'Ghosted', color: 'default' },
  fake: { label: 'Fake', color: 'secondary' }
};

export const JOB_STATUS_ORDER: JobStatus[] = ['applied', 'interviewing', 'offer', 'rejected', 'ghosted', 'fake'];
