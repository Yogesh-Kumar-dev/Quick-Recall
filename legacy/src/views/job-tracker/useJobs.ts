import { useCallback } from 'react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as jobsRepository from './jobsRepository';

// types
import type { JobApplication, JobApplicationInput } from 'types/job-tracker';

// ==============================|| JOB TRACKER - useJobs HOOK ||============================== //

// Bridges UI ↔ repository. The list is a LIVE query: Dexie re-runs it and the
// component re-renders automatically whenever the jobs table changes — including
// edits made in another browser tab. So there's no local state to keep in sync and
// no optimistic patching; mutations just write, and the live query reflects them.
// Components never call the repository directly — they go through here.

type SnackColor = 'success' | 'error';

export default function useJobs() {
  const dispatch = useDispatch();

  // `undefined` until the first query resolves → that's our loading signal.
  const jobs = useLiveQuery(() => jobsRepository.getAll());
  const loading = jobs === undefined;

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

  const addJob = useCallback(
    async (input: JobApplicationInput) => {
      try {
        await jobsRepository.create(input);
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
        await jobsRepository.update(id, input);
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
        await jobsRepository.update(job.id, { ...base, ...partial });
      } catch {
        notify('Could not update job application.', 'error');
      }
    },
    [notify]
  );

  return { jobs: jobs ?? [], loading, addJob, editJob, deleteJob, patchJob };
}
