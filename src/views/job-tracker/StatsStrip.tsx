// material-ui
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// project imports
import { deriveStats } from './jobStats';

// types
import type { JobApplication } from 'types/job-tracker';

// ==============================|| JOB TRACKER - STATS STRIP ||============================== //

interface StatTileProps {
  label: string;
  value: string | number;
  hint?: string;
  color?: string;
}

function StatTile({ label, value, hint, color }: StatTileProps) {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1.25, borderRadius: 2, minWidth: 120, flex: '1 1 auto' }}>
      <Typography variant="h3" sx={{ color: color ?? 'text.primary', lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
        {label}
      </Typography>
      {hint && (
        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
          {hint}
        </Typography>
      )}
    </Paper>
  );
}

interface StatsStripProps {
  jobs: JobApplication[];
}

export default function StatsStrip({ jobs }: StatsStripProps) {
  const stats = deriveStats(jobs);

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
      <StatTile label="Total" value={stats.total} />
      <StatTile label="Active" value={stats.active} color="info.main" />
      <StatTile label="Upcoming interviews" value={stats.upcoming} color="warning.dark" />
      <StatTile label="Response rate" value={`${stats.responseRate}%`} color="primary.main" />
      <StatTile label="Offer rate" value={`${stats.offerRate}%`} color="success.main" />
      <StatTile label="Stale" value={stats.stale} hint="applied, no movement" color={stats.stale > 0 ? 'warning.main' : 'text.primary'} />
    </Box>
  );
}
