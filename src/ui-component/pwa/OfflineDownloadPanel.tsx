'use client';

// material-ui
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';

// assets
import { IconCheck, IconAlertTriangle, IconDownload, IconRefresh, IconCircleDashed, IconCircleCheck } from '@tabler/icons-react';

// project imports
import type { UseOfflineDownload, SectionProgress } from 'hooks/useOfflineDownload';

// ==============================|| PWA - OFFLINE DOWNLOAD PANEL ||============================== //
//
// Dialog listing each content section with its own Download control + progress, plus an overall
// bar and a "Download everything" action. Pure presentation: all state comes from the
// useOfflineDownload hook passed in by the button.

interface Props {
  open: boolean;
  onClose: () => void;
  download: UseOfflineDownload;
}

function statusIcon(status: SectionProgress['status']) {
  if (status === 'done') return <IconCheck size={18} color="#2e7d32" />;
  if (status === 'error') return <IconAlertTriangle size={18} color="#ed6c02" />;
  if (status === 'stale') return <IconRefresh size={18} color="#ed6c02" />;
  if (status === 'partial') return <IconCircleDashed size={18} color="#0288d1" />;
  if (status === 'downloading') return <CircularProgress size={14} thickness={6} />;
  return null;
}

// Short caption shown after a section label to convey its saved state at a glance.
function statusLabel(s: SectionProgress): string {
  switch (s.status) {
    case 'done':
      return 'Saved';
    case 'partial':
      return 'Partially saved';
    case 'stale':
      return 'Update available';
    case 'error':
      return 'Needs connection';
    case 'queued':
      return 'Queued';
    case 'downloading':
      return 'Downloading';
    default:
      return '';
  }
}

// Per-section action label: nothing actionable while it's working, otherwise Download/Re-download.
function sectionButtonLabel(s: SectionProgress): string {
  if (s.status === 'done') return 'Re-download';
  if (s.status === 'stale') return 'Update';
  if (s.status === 'partial') return 'Finish';
  return 'Download';
}

export default function OfflineDownloadPanel({ open, onClose, download }: Props) {
  const { sections, overallProgress, isRunning, isSupported, isStale, isChecking, justCompleted, enqueueSection, enqueueAll } = download;
  const allSaved = !isChecking && sections.length > 0 && sections.every((s) => s.status === 'done');
  // Celebrate when a run just finished and everything is saved (and not freshly stale again).
  const showUpToDate = justCompleted && allSaved && !isStale && !isRunning;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="offline-download-title">
      <DialogTitle id="offline-download-title">Download for offline</DialogTitle>
      <DialogContent dividers>
        {!isSupported ? (
          <Typography color="text.secondary">Offline downloads aren&apos;t supported in this browser (no service worker).</Typography>
        ) : (
          <Stack spacing={2.5}>
            <Typography variant="body2" color="text.secondary">
              {isChecking
                ? 'Checking what’s already saved…'
                : 'Save sections so they work without a connection — pick the ones you need, or download everything. Core is fetched first automatically. You can keep using the app while it downloads.'}
            </Typography>

            {isStale && (
              <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <IconRefresh size={18} />
                A new version is available. Re-download to refresh your saved offline content.
              </Typography>
            )}

            {showUpToDate && (
              <Typography
                variant="body2"
                color="success.main"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}
              >
                <IconCircleCheck size={18} />
                You’re all set and up to date — go prepare for your interview. All the best! 🎯
              </Typography>
            )}

            {/* overall */}
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography variant="subtitle2">Overall</Typography>
                <Typography variant="caption" color="text.secondary">
                  {overallProgress}%
                </Typography>
              </Stack>
              <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 8, borderRadius: 1 }} />
            </Box>

            {/* per-section */}
            <Stack spacing={1.5}>
              {sections.map((s) => {
                const pct = s.total ? Math.round((s.completed / s.total) * 100) : 0;
                const busy = s.status === 'downloading' || s.status === 'queued';
                const actionable = !isChecking && !busy;
                return (
                  <Box key={s.id}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ minWidth: 0 }}>
                        {statusIcon(s.status)}
                        <Typography variant="body2" noWrap>
                          {s.label}
                        </Typography>
                        {statusLabel(s) && (
                          <Typography variant="caption" color="text.secondary" noWrap>
                            · {statusLabel(s)}
                          </Typography>
                        )}
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                          {s.completed}/{s.total}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          disabled={!actionable}
                          onClick={() => enqueueSection(s.id)}
                          sx={{ minWidth: 0, px: 1 }}
                        >
                          {busy ? '…' : sectionButtonLabel(s)}
                        </Button>
                      </Stack>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      color={s.status === 'error' ? 'warning' : 'primary'}
                      sx={{ height: 6, borderRadius: 1 }}
                    />
                  </Box>
                );
              })}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button
          onClick={enqueueAll}
          variant="contained"
          disabled={!isSupported || isRunning || isChecking || (allSaved && !isStale)}
          startIcon={isStale ? <IconRefresh size={18} /> : <IconDownload size={18} />}
        >
          {isRunning ? 'Downloading…' : isStale ? 'Re-download all' : allSaved ? 'All saved' : 'Download everything'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
