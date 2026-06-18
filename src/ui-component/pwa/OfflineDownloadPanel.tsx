'use client';

// material-ui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// leafygreen (real MongoDB components)
import {
  LGModal,
  LGModalSize,
  LGButton,
  LGButtonVariant,
  LGProgressBar,
  LGProgressBarVariant,
  LGProgressBarSize
} from 'ui-component/leafygreen';

// assets
import { IconCheck, IconAlertTriangle, IconDownload, IconRefresh, IconCircleDashed, IconCircleCheck } from '@tabler/icons-react';

// project imports
import type { UseOfflineDownload, SectionProgress } from 'hooks/useOfflineDownload';

// ==============================|| PWA - OFFLINE DOWNLOAD PANEL ||============================== //
//
// Modal listing each content section with its own Download control + progress, plus an overall
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
    <LGModal
      open={open}
      setOpen={(next) => {
        if (!next) onClose();
      }}
      size={LGModalSize.Default}
    >
      <Typography variant="h4" gutterBottom>
        Download for offline
      </Typography>

      {!isSupported ? (
        <Typography color="text.secondary">Offline downloads aren&apos;t supported in this browser (no service worker).</Typography>
      ) : (
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {isChecking
              ? 'Checking what’s already saved…'
              : 'Save sections so they work without a connection — pick the ones you need, or download everything. Core is fetched first automatically. You can keep using the app while it downloads.'}
          </Typography>

          {isStale && (
            <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <IconRefresh size={18} />A new version is available. Re-download to refresh your saved offline content.
            </Typography>
          )}

          {showUpToDate && (
            <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}>
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
            <LGProgressBar label="Overall download progress" value={overallProgress} maxValue={100} variant={LGProgressBarVariant.Info} />
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
                      <LGButton size="xsmall" variant={LGButtonVariant.Default} disabled={!actionable} onClick={() => enqueueSection(s.id)}>
                        {busy ? '…' : sectionButtonLabel(s)}
                      </LGButton>
                    </Stack>
                  </Stack>
                  <LGProgressBar
                    label={`${s.label} download progress`}
                    value={pct}
                    maxValue={100}
                    size={LGProgressBarSize.Small}
                    variant={s.status === 'error' ? LGProgressBarVariant.Warning : LGProgressBarVariant.Info}
                  />
                </Box>
              );
            })}
          </Stack>
        </Stack>
      )}

      {/* actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <LGButton variant={LGButtonVariant.Default} onClick={onClose}>
          Close
        </LGButton>
        <LGButton
          variant={LGButtonVariant.Primary}
          disabled={!isSupported || isRunning || isChecking || (allSaved && !isStale)}
          leftGlyph={isStale ? <IconRefresh size={18} /> : <IconDownload size={18} />}
          onClick={enqueueAll}
        >
          {isRunning ? 'Downloading…' : isStale ? 'Re-download all' : allSaved ? 'All saved' : 'Download everything'}
        </LGButton>
      </Box>
    </LGModal>
  );
}
