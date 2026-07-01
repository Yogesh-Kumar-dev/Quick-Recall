// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import JobCard from './JobCard';
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from './statusConfig';
import { useAutoAnimate } from 'ui-component/extended/AutoAnimate';

// types
import type { JobApplication, JobStatus } from 'types/job-tracker';

// ==============================|| JOB TRACKER - KANBAN BOARD ||============================== //

interface KanbanBoardProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, status: JobStatus) => void;
  onToggleFavorite: (job: JobApplication) => void;
}

const BORDER_COLOR: Record<JobStatus, string> = {
  applied: 'info.main',
  interviewing: 'warning.main',
  offer: 'success.main',
  rejected: 'error.main',
  ghosted: 'grey.500',
  fake: 'secondary.main'
};

export default function KanbanBoard({ jobs, onEdit, onDelete, onStatusChange, onToggleFavorite }: KanbanBoardProps) {
  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
      {JOB_STATUS_ORDER.map((statusKey) => (
        <KanbanColumn
          key={statusKey}
          statusKey={statusKey}
          jobs={jobs.filter((job) => job.status === statusKey)}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </Box>
  );
}

// ==============================|| JOB TRACKER - KANBAN COLUMN ||============================== //

interface KanbanColumnProps {
  statusKey: JobStatus;
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (job: JobApplication) => void;
  onStatusChange: (job: JobApplication, status: JobStatus) => void;
  onToggleFavorite: (job: JobApplication) => void;
}

function KanbanColumn({ statusKey, jobs, onEdit, onDelete, onStatusChange, onToggleFavorite }: KanbanColumnProps) {
  const [cardsRef] = useAutoAnimate<HTMLDivElement>();

  return (
    <Box sx={{ flex: '0 0 300px', width: 300 }}>
      {/* Column header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1,
          py: 0.75,
          mb: 1,
          borderBottom: '2px solid',
          borderColor: BORDER_COLOR[statusKey]
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {JOB_STATUS_CONFIG[statusKey].label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {jobs.length}
        </Typography>
      </Box>

      {/* Column cards */}
      <Stack spacing={1.5} ref={cardsRef}>
        {jobs.length === 0 ? (
          <Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>
            Nothing here
          </Typography>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onToggleFavorite={onToggleFavorite}
            />
          ))
        )}
      </Stack>
    </Box>
  );
}
