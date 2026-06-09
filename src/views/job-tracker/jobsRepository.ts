// types
import type { JobApplication, JobApplicationInput } from 'types/job-tracker';

// ==============================|| JOB TRACKER - REPOSITORY ||============================== //

// This is the ONLY module that touches persistence (currently localStorage).
// All methods are async-shaped (return Promises) on purpose: to migrate to a
// SQLite (or HTTP) backend later, replace the body of these four functions only —
// every consumer (useJobs, the drawer, the cards) stays untouched.

const STORAGE_KEY = 'quickrecall.jobs';

// Guard the collection fields so a malformed/partial record can't crash the UI.
function normalizeJob(raw: JobApplication): JobApplication {
  return {
    ...raw,
    rounds: Array.isArray(raw.rounds) ? raw.rounds : [],
    contacts: Array.isArray(raw.contacts) ? raw.contacts : [],
    documents: Array.isArray(raw.documents) ? raw.documents : [],
    notes: Array.isArray(raw.notes) ? raw.notes : []
  };
}

function readStore(): JobApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as JobApplication[]).map(normalizeJob) : [];
  } catch {
    // corrupted / unreadable store — start clean rather than crash
    return [];
  }
}

function writeStore(jobs: JobApplication[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  } catch {
    // quota / serialization failure — no-op for the UI-only milestone
  }
}

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function getAll(): Promise<JobApplication[]> {
  // newest first
  return readStore().sort((a, b) => b.createdAt - a.createdAt);
}

export async function create(input: JobApplicationInput): Promise<JobApplication> {
  const now = Date.now();
  const job: JobApplication = { ...input, id: makeId(), createdAt: now, updatedAt: now };
  const jobs = readStore();
  writeStore([job, ...jobs]);
  return job;
}

export async function update(id: string, input: JobApplicationInput): Promise<JobApplication> {
  const jobs = readStore();
  const existing = jobs.find((j) => j.id === id);
  if (!existing) {
    throw new Error('Job application not found');
  }
  const updated: JobApplication = { ...existing, ...input, id, updatedAt: Date.now() };
  writeStore(jobs.map((j) => (j.id === id ? updated : j)));
  return updated;
}

export async function remove(id: string): Promise<void> {
  const jobs = readStore();
  writeStore(jobs.filter((j) => j.id !== id));
}
