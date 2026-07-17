'use client';
/**
 * IMAGE CAROUSEL — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: index state with wrap-around modulo math, auto-advance
 * interval that pauses on hover, dot indicators.
 *
 * Styling is intentionally minimal — the index/interval logic is the interview.
 */
import { useEffect, useState } from 'react';

const SLIDES = [
  { color: '#3b82f6', label: 'Slide 1' },
  { color: '#22c55e', label: 'Slide 2' },
  { color: '#eab308', label: 'Slide 3' },
  { color: '#ef4444', label: 'Slide 4' }
];

export default function ImageCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // (i + 1) % n wraps forward; (i - 1 + n) % n wraps backward without going negative
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  // Auto-advance every 2s, paused while hovered
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 2000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{ maxWidth: 360, margin: '0 auto', padding: 24 }}
    >
      <div
        style={{
          height: 180,
          borderRadius: 8,
          background: SLIDES[index].color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700
        }}
      >
        {SLIDES[index].label}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <button onClick={prev} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          ‹ Prev
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${s.label}`}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                background: i === index ? '#333' : '#ccc'
              }}
            />
          ))}
        </div>
        <button onClick={next} style={{ padding: '6px 14px', cursor: 'pointer' }}>
          Next ›
        </button>
      </div>
      <p style={{ fontSize: 12, textAlign: 'center', marginTop: 8 }}>{paused ? 'Paused (hover)' : 'Auto-playing'}</p>
    </div>
  );
}
