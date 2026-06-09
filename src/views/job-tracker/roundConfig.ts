// types
import type { InterviewOutcome } from 'types/job-tracker';

// ==============================|| JOB TRACKER - ROUND OUTCOME CONFIG ||============================== //

// Single source of truth for an interview round's outcome → label + color.
// Reused by the drawer's outcome select and the card's round chip.

type OutcomeColor = 'default' | 'success' | 'error';

// `color` feeds MUI components (Chip/etc.); `sxColor` is a theme palette path for
// `sx`-based styling (e.g. the timeline icons on the card).
export const INTERVIEW_OUTCOME_CONFIG: Record<InterviewOutcome, { label: string; color: OutcomeColor; sxColor: string }> = {
  pending: { label: 'Pending', color: 'default', sxColor: 'text.disabled' },
  passed: { label: 'Passed', color: 'success', sxColor: 'success.main' },
  failed: { label: 'Failed', color: 'error', sxColor: 'error.main' }
};

export const INTERVIEW_OUTCOME_ORDER: InterviewOutcome[] = ['pending', 'passed', 'failed'];

// Preconfigured round-name suggestions for the drawer's combobox. Users can pick one
// or type their own (the field is free-text).
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
