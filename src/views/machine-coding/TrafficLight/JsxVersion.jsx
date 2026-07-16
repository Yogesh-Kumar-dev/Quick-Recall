'use client';
/**
 * TRAFFIC LIGHT — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key concepts: modeling a state machine as data, setTimeout-per-state in
 * useEffect (each state schedules the next), cleanup on unmount.
 *
 * Styling is intentionally minimal — the state machine is the interview.
 */
import { useEffect, useState } from 'react';

// The whole state machine as data: color → how long to stay + where to go next.
// Changing the config changes the behavior; the component never hardcodes order.
const LIGHTS = {
  green: { durationMs: 3000, next: 'yellow' },
  yellow: { durationMs: 1000, next: 'red' },
  red: { durationMs: 4000, next: 'green' }
};

export default function TrafficLight() {
  const [active, setActive] = useState('green');

  useEffect(() => {
    // One timeout per state; when it fires we move on, which re-runs this effect.
    const id = setTimeout(() => {
      setActive(LIGHTS[active].next);
    }, LIGHTS[active].durationMs);
    return () => clearTimeout(id);
  }, [active]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 14, background: '#333', borderRadius: 12 }}>
        {Object.keys(LIGHTS).map((color) => (
          <div
            key={color}
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: color,
              opacity: active === color ? 1 : 0.2,
              transition: 'opacity 0.3s'
            }}
          />
        ))}
      </div>
      <p style={{ fontSize: 13 }}>
        Active: <strong>{active}</strong> ({LIGHTS[active].durationMs / 1000}s)
      </p>
    </div>
  );
}
