import { useCallback, useEffect, useState } from 'react';

// project imports
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as jobsRepository from './jobsRepository';

// types
import type { JobApplication, JobApplicationInput } from 'types/job-tracker';

// ==============================|| JOB TRACKER - useJobs HOOK ||============================== //

// Owns the in-memory list and bridges UI ↔ repository. Components never call the
// repository (or localStorage) directly — they go through here.

type SnackColor = 'success' | 'error';

export default function useJobs() {
  const dispatch = useDispatch();
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const notify = useCallback(
    (message: string, color: SnackColor) => {
      dispatch(
        openSnackbar({
          open: true,
          message,
          variant: 'alert',
          alert: { color },
          close: false
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    let active = true;
    jobsRepository
      .getAll()
      .then((data) => {
        if (active) setJobs(data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const addJob = useCallback(
    async (input: JobApplicationInput) => {
      try {
        const created = await jobsRepository.create(input);
        setJobs((prev) => [created, ...prev]);
        notify('Job application added.', 'success');
      } catch {
        notify('Could not add job application.', 'error');
      }
    },
    [notify]
  );

  const editJob = useCallback(
    async (id: string, input: JobApplicationInput) => {
      try {
        const updated = await jobsRepository.update(id, input);
        setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
        notify('Job application updated.', 'success');
      } catch {
        notify('Could not update job application.', 'error');
      }
    },
    [notify]
  );

  const deleteJob = useCallback(
    async (id: string) => {
      try {
        await jobsRepository.remove(id);
        setJobs((prev) => prev.filter((j) => j.id !== id));
        notify('Job application deleted.', 'success');
      } catch {
        notify('Could not delete job application.', 'error');
      }
    },
    [notify]
  );

  // Lightweight partial update used by quick inline actions (status menu, favorite
  // star) where the full edit form isn't involved.
  const patchJob = useCallback(
    async (job: JobApplication, partial: Partial<JobApplicationInput>) => {
      try {
        // Rebuild the input from the job's own fields (excluding server-managed and
        // deprecated ones) so the payload matches JobApplicationInput, then apply the patch.
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
        const updated = await jobsRepository.update(job.id, { ...base, ...partial });
        setJobs((prev) => prev.map((j) => (j.id === job.id ? updated : j)));
      } catch {
        notify('Could not update job application.', 'error');
      }
    },
    [notify]
  );

  return { jobs, loading, addJob, editJob, deleteJob, patchJob };
}
