'use client';
/**
 * VIRTUALIZED LIST — TYPESCRIPT VERSION (IntersectionObserver reveal)
 * ──────────────────────────────────────────────────────────────────────────────
 * Same "reveal in batches" technique as the JSX version, with explicit types.
 *
 * Why a ref for the visible count?
 * The IntersectionObserver callback is created once (empty deps []). Reading the
 * `visible` state inside it would capture a stale value. We mirror the count into
 * a ref so the callback always reads the latest value without re-creating itself.
 */
import { useState, useEffect, useRef } from 'react';

const TOTAL = 100;
const BATCH = 20;

// Fixed list of 100 items: 1 … 100
const ITEMS: number[] = Array.from({ length: TOTAL }, (_, i) => i + 1);

export default function VirtualizedList() {
  const [visible, setVisible] = useState<number>(BATCH);

  const visibleRef = useRef<number>(BATCH);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const revealMore = (): void => {
    if (visibleRef.current >= TOTAL) return;
    const next = Math.min(visibleRef.current + BATCH, TOTAL);
    visibleRef.current = next;
    setVisible(next);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) revealMore();
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []); // intentionally empty: revealMore reads from a ref, no stale-closure risk

  return (
    <div>
      <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
        Showing {visible} / {TOTAL} divs. Scroll inside the box to reveal more.
      </p>

      <div style={{ height: 500, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 8, padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ITEMS.slice(0, visible).map((n) => (
            <div
              key={n}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: 48,
                padding: '0 16px',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                background: '#fff'
              }}
            >
              <strong style={{ fontSize: 14 }}>div {n}</strong>
              <span style={{ fontSize: 11, background: '#e3f2fd', color: '#1976d2', padding: '1px 8px', borderRadius: 8 }}>#{n}</span>
            </div>
          ))}
        </div>

        {visible >= TOTAL ? (
          <p style={{ textAlign: 'center', fontSize: 14, color: '#999', padding: '12px 0' }}>All {TOTAL} divs revealed.</p>
        ) : (
          <div ref={sentinelRef} style={{ height: 1 }} />
        )}
      </div>
    </div>
  );
}
