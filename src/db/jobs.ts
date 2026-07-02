// project imports
import { db } from './index';

// types
import type { JobApplication, JobApplicationInput } from '@/types/job-tracker';

// The ONLY module that touches persistence (Dexie / IndexedDB via the shared `db`) for
// jobs. All methods are async-shaped on purpose: to migrate to an HTTP / server backend
// later, replace the body of these functions only — every consumer (useJobs, the drawer,
// the cards) stays untouched.

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

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function getAll(): Promise<JobApplication[]> {
  // newest first
  const rows = await db.jobs.orderBy('createdAt').reverse().toArray();
  return rows.map(normalizeJob);
}

export async function create(input: JobApplicationInput): Promise<JobApplication> {
  const now = Date.now();
  const job: JobApplication = { ...input, id: makeId(), createdAt: now, updatedAt: now };
  await db.jobs.add(job);
  return job;
}

export async function update(id: string, input: JobApplicationInput): Promise<JobApplication> {
  const existing = await db.jobs.get(id);
  if (!existing) {
    throw new Error('Job application not found');
  }
  const updated: JobApplication = { ...existing, ...input, id, updatedAt: Date.now() };
  await db.jobs.put(updated);
  return updated;
}

export async function remove(id: string): Promise<void> {
  await db.jobs.delete(id);
}
