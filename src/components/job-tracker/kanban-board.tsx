'use client';

import { cn } from '@/lib/utils';
import type { JobApplication, JobStatus } from '@/types/job-tracker';
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from './config';
import JobCard from './job-card';

// ==============================|| JOB TRACKER - KANBAN BOARD ||============================== //

interface Handlers {
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, status: JobStatus) => void;
  onToggleFavorite: (job: JobApplication) => void;
}

export default function KanbanBoard({ jobs, ...handlers }: { jobs: JobApplication[] } & Handlers) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-1">
      {JOB_STATUS_ORDER.map((statusKey) => (
        <KanbanColumn key={statusKey} statusKey={statusKey} jobs={jobs.filter((job) => job.status === statusKey)} {...handlers} />
      ))}
    </div>
  );
}

function KanbanColumn({ statusKey, jobs, ...handlers }: { statusKey: JobStatus; jobs: JobApplication[] } & Handlers) {
  const cfg = JOB_STATUS_CONFIG[statusKey];
  return (
    <div className="w-[300px] shrink-0">
      <div className={cn('mb-2 flex items-center justify-between border-b-2 px-1 py-1.5', cfg.colBorder)}>
        <span className="text-sm font-bold">{cfg.label}</span>
        <span className="text-xs text-muted-foreground">{jobs.length}</span>
      </div>
      <div className="flex flex-col gap-3">
        {jobs.length === 0 ? (
          <p className="px-1 text-xs text-muted-foreground/70">Nothing here</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id} job={job} {...handlers} />)
        )}
      </div>
    </div>
  );
}
