'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import * as jobsRepository from '@/db/jobs';
import type { JobApplication, JobApplicationInput } from '@/types/job-tracker';

// ==============================|| JOB TRACKER - useJobs HOOK ||============================== //

export default function useJobs() {
  // undefined until the first query resolves — doubles as the loading signal
  const jobs = useLiveQuery(() => jobsRepository.getAll());
  const loading = jobs === undefined;

  const addJob = useCallback(async (input: JobApplicationInput) => {
    try {
      await jobsRepository.create(input);
      toast.success('Job application added.');
    } catch {
      toast.error('Could not add job application.');
    }
  }, []);

  const editJob = useCallback(async (id: string, input: JobApplicationInput) => {
    try {
      await jobsRepository.update(id, input);
      toast.success('Job application updated.');
    } catch {
      toast.error('Could not update job application.');
    }
  }, []);

  const deleteJob = useCallback(async (id: string) => {
    try {
      await jobsRepository.remove(id);
      toast.success('Job application deleted.');
    } catch {
      toast.error('Could not delete job application.');
    }
  }, []);

  // used by quick inline actions (status menu, favorite star) that skip the full edit form
  const patchJob = useCallback(async (job: JobApplication, partial: Partial<JobApplicationInput>) => {
    try {
      const base: JobApplicationInput = {
        companyName: job.companyName,
        jobTitle: job.jobTitle,
        status: job.status,
        jobDescription: job.jobDescription,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryCurrency: job.salaryCurrency,
        location: job.location,
        workMode: job.workMode,
        source: job.source,
        sourceUrl: job.sourceUrl,
        appliedAt: job.appliedAt,
        favorite: job.favorite,
        rounds: job.rounds,
        contacts: job.contacts,
        documents: job.documents,
        notes: job.notes
      };
      await jobsRepository.update(job.id, { ...base, ...partial });
    } catch {
      toast.error('Could not update job application.');
    }
  }, []);

  return { jobs: jobs ?? [], loading, addJob, editJob, deleteJob, patchJob };
}
