import { db } from '@/db';
import type { JobApplication, JobStatus } from '@/types/job-tracker';

// ==============================|| JOB TRACKER - DEV SEED ||============================== //

// Helper to reset the jobs table to a known set. Each run DROPS all existing jobs and
// inserts these specific records. Two ways to trigger it:
//
//   • Desktop console:  await window.__seedJobs()
//   • Mobile / any:     open /job-tracker?seed=1  → confirms before wiping (see JobTracker)
//
// It runs in the browser (the DB is IndexedDB, client-side, per-device). The live query
// means the UI updates immediately after seeding — no reload needed. Because it WIPES
// the table, the URL trigger is gated behind a confirm() prompt.

const SEED: Array<{ companyName: string; jobTitle: string; status: JobStatus }> = [
  { companyName: 'Bruno', jobTitle: 'Full Stack Developer', status: 'rejected' },
  { companyName: 'xTransMatrix', jobTitle: 'Full Stack Developer', status: 'ghosted' },
  { companyName: 'EY', jobTitle: 'Senior React Consultant', status: 'ghosted' },
  { companyName: 'inXiteOut', jobTitle: 'Senior Full Stack Developer', status: 'rejected' },
  { companyName: 'Mistura technologies', jobTitle: 'Software Developer', status: 'ghosted' },
  { companyName: 'NeoFi', jobTitle: 'Full Stack Developer', status: 'ghosted' },
  { companyName: 'Welspun', jobTitle: 'MERN Stack Developer', status: 'interviewing' }
];

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export async function seedJobs(): Promise<number> {
  const now = Date.now();
  // Stagger createdAt so the list's newest-first ordering is deterministic: the first
  // SEED entry ends up at the top.
  const records: JobApplication[] = SEED.map((s, i) => {
    const ts = now - (SEED.length - 1 - i) * 1000;
    return { ...s, id: makeId(), rounds: [], contacts: [], documents: [], notes: [], createdAt: ts, updatedAt: ts };
  });

  await db.transaction('rw', db.jobs, async () => {
    await db.jobs.clear();
    await db.jobs.bulkAdd(records);
  });

  console.info(`[seedJobs] reset jobs table → inserted ${records.length} records`);
  return records.length;
}

// Expose on window for console use (handy on desktop in any environment).
if (typeof window !== 'undefined') {
  (window as unknown as { __seedJobs?: typeof seedJobs }).__seedJobs = seedJobs;
}
