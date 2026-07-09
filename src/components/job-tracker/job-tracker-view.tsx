'use client';

import Fuse from 'fuse.js';
import { LayoutGrid, LayoutList, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { JobApplication, JobApplicationInput, JobStatus } from '@/types/job-tracker';
import { INTERVIEW_OUTCOME_CONFIG, JOB_SOURCE_CONFIG, JOB_STATUS_CONFIG, JOB_STATUS_ORDER, WORK_MODE_CONFIG } from './config';
import JobCard from './job-card';
import JobFormDrawer from './job-form-drawer';
import JobsEmptyState from './jobs-empty-state';
import KanbanBoard from './kanban-board';
import { seedJobs } from './seed';
import { formatSalary } from './stats';
import StatsStrip from './stats-strip';
import useJobs from './use-jobs';

// ==============================|| JOB TRACKER ||============================== //

type StatusFilter = JobStatus | 'all';
type ViewMode = 'list' | 'board';

// Rank for ordering the listing by interview activity:
//  - jobs with an upcoming round sort first, soonest date ascending
//  - then jobs whose rounds are all in the past, most recent first
//  - then jobs with no rounds, by created date (newest first)
function sortRank(job: JobApplication): [number, number] {
  const times = (job.rounds ?? []).map((r) => new Date(r.at).getTime()).filter((t) => !Number.isNaN(t));
  if (times.length === 0) return [2, -job.createdAt];
  const now = Date.now();
  const upcoming = times.filter((t) => t >= now);
  if (upcoming.length > 0) return [0, Math.min(...upcoming)];
  return [1, -Math.max(...times)];
}

function byInterviewDate(a: JobApplication, b: JobApplication): number {
  const [ga, va] = sortRank(a);
  const [gb, vb] = sortRank(b);
  return ga !== gb ? ga - gb : va - vb;
}

// Flatten a job into a single searchable string covering every meaningful field so Fuse
// can match a query against any data present on the application.
function searchableText(job: JobApplication): string {
  const parts: (string | undefined)[] = [
    job.companyName,
    job.jobTitle,
    job.jobDescription,
    job.location,
    formatSalary(job) || undefined,
    job.workMode ? WORK_MODE_CONFIG[job.workMode].label : undefined,
    job.source ? JOB_SOURCE_CONFIG[job.source].label : undefined,
    job.sourceUrl,
    JOB_STATUS_CONFIG[job.status]?.label,
    ...(job.rounds ?? []).flatMap((r) => [r.name, INTERVIEW_OUTCOME_CONFIG[r.outcome]?.label]),
    ...(job.contacts ?? []).flatMap((c) => [c.name, c.role, c.email, c.phone]),
    ...(job.documents ?? []).map((d) => d.label),
    ...(job.notes ?? []).map((n) => n.text)
  ];
  return parts.filter(Boolean).join(' ');
}

type SearchEntry = { job: JobApplication; text: string };

function createJobsFuse(jobs: JobApplication[]): Fuse<SearchEntry> {
  const entries: SearchEntry[] = jobs.map((job) => ({ job, text: searchableText(job) }));
  return new Fuse(entries, { keys: ['text'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 });
}

function ChipFilter({
  active,
  count,
  label,
  colorClass,
  onClick
}: {
  active: boolean;
  count: number;
  label: string;
  colorClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : cn('hover:bg-accent', colorClass)
      )}
    >
      <span className="font-bold">{count}</span> {label}
    </button>
  );
}

export default function JobTrackerView() {
  const { jobs, loading, addJob, editJob, deleteJob, patchJob } = useJobs();

  // ?seed=1 → reset the jobs table to the sample set. Works on any device. Because it
  // WIPES current data, confirm first, then strip the param so a refresh can't re-trigger.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('seed') !== '1') return;
    const clearParam = () => {
      params.delete('seed');
      const qs = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
    };
    if (window.confirm('This deletes all current jobs on this device and loads sample data. Continue?')) {
      void seedJobs().finally(clearParam);
    } else {
      clearParam();
    }
  }, []);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [view, setView] = useState<ViewMode>('list');

  const fuse = useMemo(() => createJobsFuse(jobs), [jobs]);

  const counts = useMemo(() => {
    const map = { applied: 0, interviewing: 0, offer: 0, rejected: 0, ghosted: 0, fake: 0 } as Record<JobStatus, number>;
    for (const job of jobs) map[job.status] += 1;
    return map;
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim();
    const matched = q ? fuse.search(q).map((result) => result.item.job) : jobs;
    return matched.filter((job) => statusFilter === 'all' || job.status === statusFilter).sort(byInterviewDate);
  }, [jobs, fuse, search, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setDrawerOpen(true);
  };
  const openEdit = (job: JobApplication) => {
    setEditing(job);
    setDrawerOpen(true);
  };

  const handleSubmit = async (values: JobApplicationInput) => {
    if (editing) await editJob(editing.id, values);
    else await addJob(values);
  };

  const confirmDelete = async () => {
    if (pendingDelete) {
      await deleteJob(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  const cardHandlers = {
    onEdit: openEdit,
    onDelete: setPendingDelete,
    onStatusChange: (job: JobApplication, status: JobStatus) => patchJob(job, { status }),
    onToggleFavorite: (job: JobApplication) => patchJob(job, { favorite: !job.favorite })
  };

  const hasJobs = jobs.length > 0;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Job Tracker</h1>
        {hasJobs && (
          <Button className="gap-1.5" onClick={openAdd}>
            <Plus className="size-4" /> Add Job
          </Button>
        )}
      </div>

      {loading ? null : !hasJobs ? (
        <JobsEmptyState onAdd={openAdd} />
      ) : (
        <div className="flex flex-col gap-6">
          <StatsStrip jobs={jobs} />

          {/* Controls */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-80">
              <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search any field…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-1.5">
                <ChipFilter active={statusFilter === 'all'} count={jobs.length} label="All" onClick={() => setStatusFilter('all')} />
                {JOB_STATUS_ORDER.map((s) => (
                  <ChipFilter
                    key={s}
                    active={statusFilter === s}
                    count={counts[s]}
                    label={JOB_STATUS_CONFIG[s].label}
                    colorClass={JOB_STATUS_CONFIG[s].badgeClass}
                    onClick={() => setStatusFilter(s)}
                  />
                ))}
              </div>
              <div className="flex shrink-0 gap-0.5">
                <Button
                  variant={view === 'list' ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setView('list')}
                  aria-label="Card view"
                >
                  <LayoutGrid className="size-[18px]" />
                </Button>
                <Button
                  variant={view === 'board' ? 'secondary' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setView('board')}
                  aria-label="Board view"
                >
                  <LayoutList className="size-[18px]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Listing */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <h2 className="text-lg font-semibold">No matching applications</h2>
              <p className="mt-1 text-sm text-muted-foreground">Try a different search term or status filter.</p>
            </div>
          ) : view === 'board' ? (
            <KanbanBoard jobs={filtered} {...cardHandlers} />
          ) : (
            <div className="gap-4 [column-fill:_balance] columns-1 sm:columns-2 lg:columns-3 [&>*]:mb-4">
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} {...cardHandlers} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add / Edit drawer */}
      {drawerOpen && (
        <JobFormDrawer
          open={drawerOpen}
          mode={editing ? 'edit' : 'add'}
          initialValues={editing}
          onClose={() => setDrawerOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* Delete confirmation */}
      <Dialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this application?</DialogTitle>
            <DialogDescription>
              {pendingDelete
                ? `“${pendingDelete.jobTitle} at ${pendingDelete.companyName}” will be permanently removed. This can’t be undone.`
                : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
