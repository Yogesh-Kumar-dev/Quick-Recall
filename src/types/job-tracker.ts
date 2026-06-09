// ==============================|| TYPES - JOB TRACKER ||============================== //

export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'ghosted' | 'fake';

export type InterviewOutcome = 'pending' | 'passed' | 'failed';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type JobSource = 'linkedin' | 'naukri' | 'indeed' | 'referral' | 'company' | 'other';

export interface InterviewRound {
  id: string;
  // ISO date-time string
  at: string;
  // optional round name, e.g. "Phone screen", "Technical", "HR"
  name?: string;
  outcome: InterviewOutcome;
}

export interface JobContact {
  id: string;
  name: string;
  role?: string; // e.g. "Recruiter", "Hiring Manager", "Referrer"
  email?: string;
  phone?: string;
}

export interface JobDocument {
  id: string;
  label: string; // e.g. "Resume v3", "Cover letter"
  url: string;
}

export interface JobNote {
  id: string;
  text: string;
  createdAt: number;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string;
  status: JobStatus;
  jobDescription?: string;

  // Compensation
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;

  // Location & mode
  location?: string;
  workMode?: WorkMode;

  // Where the lead came from
  source?: JobSource;
  sourceUrl?: string;

  // When the user actually applied (distinct from createdAt, the row's creation)
  appliedAt?: string; // ISO date string

  // Priority flag
  favorite?: boolean;

  // Multiple interview rounds, each with its own date/time, name and outcome.
  rounds: InterviewRound[];

  // Multiple contacts (recruiter, hiring manager, referrer…)
  contacts: JobContact[];

  // Documents sent for this application (links only — no file upload)
  documents: JobDocument[];

  // Timestamped activity log
  notes: JobNote[];

  createdAt: number;
  updatedAt: number;
}

export type JobApplicationInput = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
