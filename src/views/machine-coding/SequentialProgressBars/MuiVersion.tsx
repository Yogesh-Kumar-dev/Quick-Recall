'use client';
/**
 * SEQUENTIAL PROGRESS BARS — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * State shape: Bar[] = { id, progress, status }[]
 *   status: 'queued' | 'running' | 'done'
 *
 * Two-effect architecture (the core pattern):
 *
 *   Effect 1 — "start next" — depends on [activeBarId]
 *     Fires whenever activeBarId changes.
 *     If activeBarId is null → no bar is running → find the first 'queued'
 *     bar and flip it to 'running'. Uses functional setBars(prev => ...)
 *     so it doesn't need `bars` in its dependency array (avoids re-running
 *     on every progress tick).
 *
 *   Effect 2 — "animate" — depends on [activeBarId]
 *     Fires whenever activeBarId changes.
 *     If activeBarId is a real ID → start a setInterval that increments
 *     that bar's progress every TICK ms by STEP %.
 *     When progress hits 100, status flips to 'done' → activeBarId becomes
 *     null → Effect 1 fires → starts the next queued bar.
 *     Cleanup (clearInterval) runs whenever activeBarId changes or unmounts.
 *
 * Why functional setState inside setInterval?
 *   The interval callback captures `activeBarId` at creation time. If we read
 *   `bars` from the outer scope, it would be stale after the first tick.
 *   Using `setBars(prev => ...)` always receives the latest state.
 */
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';

// ── Constants ─────────────────────────────────────────────────────────────────
const DURATION = 2000; // total ms for one bar to fill
const TICK = 40; // interval cadence in ms
const STEP = (100 / DURATION) * TICK; // % to add per tick (~2%)

// ── Types ─────────────────────────────────────────────────────────────────────
type Status = 'queued' | 'running' | 'done';
interface Bar {
  id: number;
  progress: number;
  status: Status;
}

// ──────────────────────────────────────────────────────────────────────────────
export default function SequentialProgressBarsMui() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [nextId, setNextId] = useState(1);

  // Derived: the ID of whichever bar is currently animating (null = idle)
  const activeBarId = bars.find((b) => b.status === 'running')?.id ?? null;

  // ── Effect 1: start the next queued bar whenever nothing is running ──────────
  // Dependency: [activeBarId] only.
  // When activeBarId becomes null (a bar just finished or list was empty),
  // find the first 'queued' bar and flip it to 'running'.
  // Functional setState lets us read latest bars without listing them as a dep.
  useEffect(() => {
    if (activeBarId !== null) return; // something already running
    setBars((prev) => {
      const nextQueued = prev.find((b) => b.status === 'queued');
      if (!nextQueued) return prev; // nothing to start
      return prev.map((b) => (b.id === nextQueued.id ? { ...b, status: 'running' } : b));
    });
  }, [activeBarId]); // re-runs only when active bar changes — NOT on every tick

  // ── Effect 2: animate the active bar ────────────────────────────────────────
  // Dependency: [activeBarId] only.
  // Starts a setInterval that bumps progress every TICK ms.
  // At 100%: status → 'done', which causes activeBarId to become null,
  // which triggers Effect 1 to start the next bar.
  // Return value clears the interval when activeBarId changes or on unmount.
  useEffect(() => {
    if (activeBarId === null) return; // nothing to animate

    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((b) => {
          if (b.id !== activeBarId) return b; // leave other bars alone
          const newProgress = Math.min(b.progress + STEP, 100);
          return {
            ...b,
            progress: newProgress,
            status: newProgress >= 100 ? 'done' : 'running'
          };
        })
      );
    }, TICK);

    return () => clearInterval(interval); // cleanup when active bar changes
  }, [activeBarId]);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const addBar = () => {
    // Always append as 'queued' — Effect 1 will pick it up automatically
    setBars((prev) => [...prev, { id: nextId, progress: 0, status: 'queued' }]);
    setNextId((n) => n + 1);
  };

  const reset = () => {
    setBars([]);
    setNextId(1);
  };

  // ── Status chip helpers ───────────────────────────────────────────────────────
  const chipProps = (status: Status) => {
    if (status === 'running') return { label: 'Running', color: 'primary' as const };
    if (status === 'done') return { label: 'Done', color: 'success' as const };
    return { label: 'Queued', color: 'default' as const };
  };

  return (
    <Box sx={{ maxWidth: 540 }}>
      {/* Controls */}
      <Stack direction="row" spacing={1} mb={3}>
        <Button variant="contained" onClick={addBar}>
          + Add Bar
        </Button>
        <Button variant="outlined" color="error" onClick={reset} disabled={bars.length === 0}>
          Reset
        </Button>
      </Stack>

      {/* Empty state */}
      {bars.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          Click "Add Bar" to queue a progress bar.
        </Typography>
      )}

      {/* Bar list */}
      <Stack spacing={1.5}>
        {bars.map((bar) => {
          const { label, color } = chipProps(bar.status);
          return (
            <Paper key={bar.id} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
                <Typography variant="body2" fontWeight={600}>
                  Bar #{bar.id}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(bar.progress)}%
                  </Typography>
                  <Chip label={label} color={color} size="small" />
                </Stack>
              </Box>
              <LinearProgress
                variant="determinate"
                value={bar.progress}
                color={bar.status === 'done' ? 'success' : 'primary'}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}
