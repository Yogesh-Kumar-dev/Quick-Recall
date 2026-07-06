'use client';
/**
 * COUNTER — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI imports — only React hooks + native HTML + inline styles.
 * Classic first React component: increment, decrement, reset.
 *
 * Key concepts: useState, event handlers, functional updates.
 */
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  const color: string = count > 0 ? '#16a34a' : count < 0 ? '#dc2626' : '#6b7280';
  const label: string = count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 32 }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Counter</h2>

      {/* Display */}
      <span
        style={{
          fontSize: 80,
          fontWeight: 800,
          minWidth: 160,
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
          color,
          lineHeight: 1,
          transition: 'color 0.2s'
        }}
      >
        {count}
      </span>

      {/* Status label */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color,
          marginTop: -16
        }}
      >
        {label}
      </span>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12 }}>
        <button
          type="button"
          onClick={() => setCount((c) => c - 1)}
          style={{
            width: 48,
            height: 48,
            fontSize: 24,
            borderRadius: 8,
            border: '1px solid #fca5a5',
            background: '#fee2e2',
            color: '#dc2626',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setCount(0)}
          style={{
            padding: '0 20px',
            height: 48,
            fontSize: 13,
            borderRadius: 8,
            border: '1px solid #d1d5db',
            background: '#f3f4f6',
            color: '#374151',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          style={{
            width: 48,
            height: 48,
            fontSize: 24,
            borderRadius: 8,
            border: '1px solid #86efac',
            background: '#dcfce7',
            color: '#16a34a',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          +
        </button>
      </div>
    </div>
  );
}
