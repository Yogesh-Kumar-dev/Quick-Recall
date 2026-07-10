// ==============================|| TYPES - JOB TRACKER ||============================== //

export type JobStatus = 'applied' | 'interviewing' | 'offer' | 'rejected' | 'ghosted' | 'fake';

export type InterviewOutcome = 'pending' | 'passed' | 'failed';

export type WorkMode = 'remote' | 'hybrid' | 'onsite';

export type JobSource = 'linkedin' | 'naukri' | 'indeed' | 'referral' | 'company' | 'other';

export interface InterviewRound {
  id: string;
  at: string; // ISO date-time string
  name?: string; // e.g. "Phone screen", "Technical", "HR"
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

  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;

  location?: string;
  workMode?: WorkMode;

  source?: JobSource;
  sourceUrl?: string;

  appliedAt?: string; // ISO date string; distinct from createdAt (the row's creation)

  favorite?: boolean;
  rounds: InterviewRound[];
  contacts: JobContact[];
  documents: JobDocument[]; // links only, no file upload
  notes: JobNote[];

  createdAt: number;
  updatedAt: number;
}

export type JobApplicationInput = Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>;
