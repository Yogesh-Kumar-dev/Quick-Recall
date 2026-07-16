'use client';
/**
 * STOPWATCH — TYPESCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: interval lifecycle in useEffect, cleanup, computing elapsed
 * time from a start timestamp instead of incrementing a counter.
 */
import { useEffect, useRef, useState } from 'react';

function format(ms: number): string {
  const mins = String(Math.floor(ms / 60000)).padStart(2, '0');
  const secs = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  const centis = String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  return `${mins}:${secs}.${centis}`;
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  // Where "now" started counting from — computing from a timestamp keeps it drift-free.
  const startRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - elapsed;
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current);
    }, 10);
    return () => clearInterval(id); // cleanup on pause/unmount — the point of the question
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setRunning(false);
    setElapsed(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <span style={{ fontSize: 48, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{format(elapsed)}</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setRunning((r) => !r)} style={{ padding: '8px 20px', cursor: 'pointer' }}>
          {running ? 'Pause' : 'Start'}
        </button>
        <button onClick={reset} disabled={elapsed === 0} style={{ padding: '8px 20px', cursor: 'pointer' }}>
          Reset
        </button>
      </div>
    </div>
  );
}
