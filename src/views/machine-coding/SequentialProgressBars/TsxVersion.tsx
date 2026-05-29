'use client';
/**
 * SEQUENTIAL PROGRESS BARS — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Identical two-effect logic. Plain divs + inline styles.
 *
 * Pattern recap:
 *   activeBarId = bars.find(b => b.status === 'running')?.id ?? null
 *
 *   Effect 1 [activeBarId]: when null → setBars(prev => start first queued)
 *   Effect 2 [activeBarId]: when set  → setInterval to increment progress;
 *                            at 100 flip to 'done'; cleanup on change
 */
import { useEffect, useState } from 'react';

const DURATION = 2000;
const TICK = 40;
const STEP = (100 / DURATION) * TICK;

type Status = 'queued' | 'running' | 'done';
interface Bar {
  id: number;
  progress: number;
  status: Status;
}

export default function SequentialProgressBars() {
  const [bars, setBars] = useState<Bar[]>([]);
  const [nextId, setNextId] = useState(1);

  // Derived: ID of the currently animating bar
  const activeBarId = bars.find((b) => b.status === 'running')?.id ?? null;

  // ── Effect 1: start next queued bar when nothing is running ──────────────────
  useEffect(() => {
    if (activeBarId !== null) return;
    setBars((prev) => {
      const nextQueued = prev.find((b) => b.status === 'queued');
      if (!nextQueued) return prev;
      return prev.map((b) => (b.id === nextQueued.id ? { ...b, status: 'running' } : b));
    });
  }, [activeBarId]);

  // ── Effect 2: animate the running bar ────────────────────────────────────────
  useEffect(() => {
    if (activeBarId === null) return;
    const interval = setInterval(() => {
      setBars((prev) =>
        prev.map((b) => {
          if (b.id !== activeBarId) return b;
          const newProgress = Math.min(b.progress + STEP, 100);
          return { ...b, progress: newProgress, status: newProgress >= 100 ? 'done' : 'running' };
        })
      );
    }, TICK);
    return () => clearInterval(interval);
  }, [activeBarId]);

  const addBar = () => {
    setBars((prev) => [...prev, { id: nextId, progress: 0, status: 'queued' }]);
    setNextId((n) => n + 1);
  };

  const reset = () => {
    setBars([]);
    setNextId(1);
  };

  return (
    <div style={{ maxWidth: 540 }}>
      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button
          onClick={addBar}
          style={{
            padding: '8px 18px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          + Add Bar
        </button>
        <button
          onClick={reset}
          disabled={bars.length === 0}
          style={{
            padding: '8px 18px',
            background: 'transparent',
            color: bars.length === 0 ? '#bbb' : '#f44336',
            border: `1px solid ${bars.length === 0 ? '#ddd' : '#f44336'}`,
            borderRadius: 6,
            cursor: bars.length === 0 ? 'default' : 'pointer',
            fontWeight: 600,
            fontSize: 14
          }}
        >
          Reset
        </button>
      </div>

      {/* Empty state */}
      {bars.length === 0 && <p style={{ color: '#aaa', fontSize: 13 }}>Click "Add Bar" to queue a progress bar.</p>}

      {/* Bar list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {bars.map((bar) => {
          const trackColor = bar.status === 'done' ? '#4caf50' : bar.status === 'running' ? '#1976d2' : '#bdbdbd';
          const badgeBg = bar.status === 'done' ? '#e8f5e9' : bar.status === 'running' ? '#e3f2fd' : '#f5f5f5';
          const badgeColor = bar.status === 'done' ? '#388e3c' : bar.status === 'running' ? '#1565c0' : '#757575';
          const badgeLabel = bar.status === 'done' ? 'Done' : bar.status === 'running' ? 'Running' : 'Queued';

          return (
            <div key={bar.id} style={{ border: '1px solid #e0e0e0', borderRadius: 10, padding: '12px 14px', background: '#fff' }}>
              {/* Row: label + percent + status badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Bar #{bar.id}</span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#888' }}>{Math.round(bar.progress)}%</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: badgeBg,
                      color: badgeColor
                    }}
                  >
                    {badgeLabel}
                  </span>
                </div>
              </div>

              {/* Progress track */}
              <div
                style={{
                  height: 10,
                  background: '#f0f0f0',
                  borderRadius: 5,
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${bar.progress}%`,
                    background: trackColor,
                    borderRadius: 5,
                    transition: 'width 0.04s linear' // smooth between ticks
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
