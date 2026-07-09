'use client';

import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheck,
  IconCircleDashed,
  IconDownload,
  IconLoader2,
  IconRefresh
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import type { SectionProgress, UseOfflineDownload } from '@/hooks/useOfflineDownload';

// Modal listing each content section with its own Download control + progress, plus an overall
// bar and a "Download everything" action. Pure presentation: all state comes from the
// useOfflineDownload hook passed in by the button.

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  download: UseOfflineDownload;
}

function StatusIcon({ status }: { status: SectionProgress['status'] }) {
  if (status === 'done') return <IconCheck size={18} className="text-primary" />;
  if (status === 'error') return <IconAlertTriangle size={18} className="text-[color:var(--chart-4)]" />;
  if (status === 'stale') return <IconRefresh size={18} className="text-[color:var(--chart-4)]" />;
  if (status === 'partial') return <IconCircleDashed size={18} className="text-muted-foreground" />;
  if (status === 'downloading') return <IconLoader2 size={16} className="animate-spin text-muted-foreground" />;
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

export default function OfflineDownloadPanel({ open, onOpenChange, download }: Props) {
  const { sections, overallProgress, isRunning, isSupported, isStale, isChecking, justCompleted, enqueueSection, enqueueAll } = download;
  const allSaved = !isChecking && sections.length > 0 && sections.every((s) => s.status === 'done');
  // Celebrate when a run just finished and everything is saved (and not freshly stale again).
  const showUpToDate = justCompleted && allSaved && !isStale && !isRunning;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download for offline</DialogTitle>
        </DialogHeader>

        {!isSupported ? (
          <p className="text-sm text-muted-foreground">Offline downloads aren&apos;t supported in this browser (no service worker).</p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {isChecking
                ? 'Checking what’s already saved…'
                : 'Save sections so they work without a connection — pick the ones you need, or download everything. Core is fetched first automatically. You can keep using the app while it downloads.'}
            </p>

            {isStale && (
              <p className="flex items-center gap-1.5 text-sm font-medium text-[color:var(--chart-4)]">
                <IconRefresh size={18} />A new version is available. Re-download to refresh your saved offline content.
              </p>
            )}

            {showUpToDate && (
              <p className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                <IconCircleCheck size={18} />
                You're all set and up to date. Go prepare for your interview. All the best!
              </p>
            )}

            {/* overall */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold">Overall</span>
                <span className="text-xs text-muted-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} aria-label="Overall download progress" />
            </div>

            {/* per-section */}
            <div className="space-y-3">
              {sections.map((s) => {
                const pct = s.total ? Math.round((s.completed / s.total) * 100) : 0;
                const busy = s.status === 'downloading' || s.status === 'queued';
                const actionable = !isChecking && !busy;
                return (
                  <div key={s.id}>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <StatusIcon status={s.status} />
                        <span className="truncate text-sm">{s.label}</span>
                        {statusLabel(s) && <span className="shrink-0 text-xs text-muted-foreground">· {statusLabel(s)}</span>}
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {s.completed}/{s.total}
                        </span>
                        <Button size="xs" variant="outline" disabled={!actionable} onClick={() => enqueueSection(s.id)}>
                          {busy ? '…' : sectionButtonLabel(s)}
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={pct}
                      aria-label={`${s.label} download progress`}
                      className={s.status === 'error' ? '[&>div]:bg-[color:var(--chart-4)]' : undefined}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-2 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button disabled={!isSupported || isRunning || isChecking || (allSaved && !isStale)} onClick={enqueueAll}>
            {isStale ? <IconRefresh size={18} /> : <IconDownload size={18} />}
            {isRunning ? 'Downloading…' : isStale ? 'Re-download all' : allSaved ? 'All saved' : 'Download everything'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
