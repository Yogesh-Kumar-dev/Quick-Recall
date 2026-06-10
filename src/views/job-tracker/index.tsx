'use client';

import { useEffect, useMemo, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Masonry from '@mui/lab/Masonry';
import { IconLayoutGrid, IconLayoutKanban, IconPlus, IconSearch } from '@tabler/icons-react';

// third party
import Fuse from 'fuse.js';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import JobCard from './JobCard';
import JobFormDrawer from './JobFormDrawer';
import JobsEmptyState from './JobsEmptyState';
import KanbanBoard from './KanbanBoard';
import StatsStrip from './StatsStrip';
import useJobs from './useJobs';
// Registers window.__seedJobs() (desktop console) and provides seedJobs() for the
// ?seed=1 URL trigger below.
import { seedJobs } from './seedJobs';
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from './statusConfig';
import { INTERVIEW_OUTCOME_CONFIG } from './roundConfig';
import { JOB_SOURCE_CONFIG, WORK_MODE_CONFIG } from './jobConfig';
import { formatSalary } from './jobStats';

// types
import type { JobApplication, JobApplicationInput, JobStatus } from 'types/job-tracker';

// ==============================|| JOB TRACKER ||============================== //

type StatusFilter = JobStatus | 'all';

// Rank for ordering the listing by interview activity:
//  - jobs with an upcoming round sort first, soonest date ascending
//  - then jobs whose rounds are all in the past, most recent first
//  - then jobs with no rounds, by created date (newest first)
function sortRank(job: JobApplication): [number, number] {
  const times = (job.rounds ?? []).map((r) => new Date(r.at).getTime()).filter((t) => !Number.isNaN(t));
  if (times.length === 0) return [2, -job.createdAt];
  const now = Date.now();
  const upcoming = times.filter((t) => t >= now);
  if (upcoming.length > 0) return [0, Math.min(...upcoming)]; // soonest upcoming first
  return [1, -Math.max(...times)]; // most recent past first
}

function byInterviewDate(a: JobApplication, b: JobApplication): number {
  const [ga, va] = sortRank(a);
  const [gb, vb] = sortRank(b);
  return ga !== gb ? ga - gb : va - vb;
}

// Flatten a job into a single searchable string covering every meaningful field,
// including humanized status and per-round name/outcome labels. Fuse matches against
// this so a query can hit any data present on the application.
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
  return new Fuse(entries, {
    keys: ['text'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 2
  });
}

type ViewMode = 'list' | 'board';

export default function JobTracker() {
  const { jobs, loading, addJob, editJob, deleteJob, patchJob } = useJobs();

  // ?seed=1 → reset the jobs table to the sample set. Works on any device (handy on
  // mobile where there's no console). Because it WIPES current data, confirm first;
  // then strip the param so a refresh can't silently re-trigger it.
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

  // Rebuild the fuzzy index only when the underlying jobs change.
  const fuse = useMemo(() => createJobsFuse(jobs), [jobs]);

  // Count per status (and total) for the filter chips.
  const counts = useMemo(() => {
    const map = { applied: 0, interviewing: 0, offer: 0, rejected: 0, ghosted: 0, fake: 0 } as Record<JobStatus, number>;
    for (const job of jobs) map[job.status] += 1;
    return map;
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = search.trim();
    // Fuzzy-match across all fields when there's a query; otherwise take every job.
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
    if (editing) {
      await editJob(editing.id, values);
    } else {
      await addJob(values);
    }
  };

  const confirmDelete = async () => {
    if (pendingDelete) {
      await deleteJob(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  const handleStatusChange = (job: JobApplication, status: JobStatus) => patchJob(job, { status });
  const handleToggleFavorite = (job: JobApplication) => patchJob(job, { favorite: !job.favorite });

  const cardHandlers = {
    onEdit: openEdit,
    onDelete: setPendingDelete,
    onStatusChange: handleStatusChange,
    onToggleFavorite: handleToggleFavorite
  };

  const hasJobs = jobs.length > 0;

  return (
    <MainCard
      title="💼 Job Tracker"
      secondary={
        hasJobs ? (
          <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={openAdd}>
            Add Job
          </Button>
        ) : undefined
      }
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : !hasJobs ? (
        <JobsEmptyState onAdd={openAdd} />
      ) : (
        <Stack spacing={2.5}>
          {/* Stats */}
          <StatsStrip jobs={jobs} />

          {/* Controls */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ alignItems: { md: 'center' }, justifyContent: 'space-between' }}>
            <TextField
              size="small"
              placeholder="Search any field…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: { xs: '100%', md: 320 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size={18} />
                    </InputAdornment>
                  )
                }
              }}
            />
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip
                  label={
                    <>
                      <Box component="span" sx={{ fontWeight: 700 }}>
                        {jobs.length}
                      </Box>{' '}
                      All
                    </>
                  }
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                  onClick={() => setStatusFilter('all')}
                />
                {JOB_STATUS_ORDER.map((s) => (
                  <Chip
                    key={s}
                    label={
                      <>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {counts[s]}
                        </Box>{' '}
                        {JOB_STATUS_CONFIG[s].label}
                      </>
                    }
                    color={statusFilter === s ? JOB_STATUS_CONFIG[s].color : 'default'}
                    variant={statusFilter === s ? 'filled' : 'outlined'}
                    onClick={() => setStatusFilter(s)}
                  />
                ))}
              </Stack>
              <ToggleButtonGroup size="small" exclusive value={view} onChange={(_, next) => next && setView(next)} aria-label="view mode">
                <ToggleButton value="list" aria-label="list view">
                  <Tooltip title="Card view">
                    <IconLayoutGrid size={18} />
                  </Tooltip>
                </ToggleButton>
                <ToggleButton value="board" aria-label="board view">
                  <Tooltip title="Board view">
                    <IconLayoutKanban size={18} />
                  </Tooltip>
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          {/* Listing */}
          {filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h4" gutterBottom>
                No matching applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term or status filter.
              </Typography>
            </Box>
          ) : view === 'board' ? (
            <KanbanBoard jobs={filtered} {...cardHandlers} />
          ) : (
            <Masonry columns={{ xs: 1, sm: 2, lg: 3 }} spacing={2} sx={{ m: 0 }}>
              {filtered.map((job) => (
                <JobCard key={job.id} job={job} {...cardHandlers} />
              ))}
            </Masonry>
          )}
        </Stack>
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
      <Dialog open={Boolean(pendingDelete)} onClose={() => setPendingDelete(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete this application?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pendingDelete
              ? `“${pendingDelete.jobTitle} at ${pendingDelete.companyName}” will be permanently removed. This can’t be undone.`
              : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => setPendingDelete(null)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
