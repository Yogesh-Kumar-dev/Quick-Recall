import { db } from '@/db';
import type { JobApplication, JobStatus } from '@/types/job-tracker';

// ==============================|| JOB TRACKER - DEV SEED ||============================== //

// Resets the jobs table to a known set — DROPS all existing jobs first. Trigger via console
// (`await window.__seedJobs()`) or `/job-tracker?seed=1` (confirm-gated, see JobTracker).

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
  // stagger createdAt so newest-first ordering is deterministic: first SEED entry ends up on top
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

if (typeof window !== 'undefined') {
  (window as unknown as { __seedJobs?: typeof seedJobs }).__seedJobs = seedJobs;
}
