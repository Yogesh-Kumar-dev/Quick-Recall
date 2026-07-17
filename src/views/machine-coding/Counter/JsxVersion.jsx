'use client';
/**
 * COUNTER — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 *
 * Key concepts: useState, event handlers, functional updates.
 */
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // const color = count > 0 ? '#16a34a' : count < 0 ? '#dc2626' : '#6b7280';
  // const label = count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero';

  let color = 'text-gray-500';
  if (count > 0) color = 'text-green-600';
  else if (count < 0) color = 'text-red-600';

  const label = (() => {
    if (count > 0) return 'Positive';
    if (count < 0) return 'Negative';
    return 'Zero';
  })();

  return (
    <div
    className="flex flex-col items-center gap-6 p-8"
      // style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: 32 }}
    >
      <h2
        className="text-lg font-bold"
        // style={{ margin: 0, fontSize: 18, fontWeight: 700 }}
      >
        Counter
      </h2>

      {/* Display */}
      <span
          className={`min-w-[160px] text-center text-6xl font-extrabold tabular-nums leading-none transition-colors duration-200 ${color}`}
        // style={{
        //   fontSize: 80,
        //   fontWeight: 800,
        //   minWidth: 160,
        //   textAlign: 'center',
        //   fontVariantNumeric: 'tabular-nums',
        //   color,
        //   lineHeight: 1,
        //   transition: 'color 0.2s'
        // }}
      >
        {count}
      </span>

      {/* Status label */}
      <span
          className={`-mt-4 text-xs font-semibold uppercase tracking-[1.5px] ${color}`}
        // style={{
        //   fontSize: 12,
        //   fontWeight: 600,
        //   letterSpacing: 1.5,
        //   textTransform: 'uppercase',
        //   color,
        //   marginTop: -16
        // }}
      >
        {label}
      </span>

      {/* Controls */}
      <div
        className="flex gap-3"
        // style={{ display: 'flex', gap: 12 }}
      >
        <button
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-red-300 bg-red-100 text-2xl font-bold text-red-600"
          onClick={() => setCount((c) => c - 1)}
          // style={{
          //   width: 48,
          //   height: 48,
          //   fontSize: 24,
          //   borderRadius: 8,
          //   border: '1px solid #fca5a5',
          //   background: '#fee2e2',
          //   color: '#dc2626',
          //   cursor: 'pointer',
          //   fontWeight: 700,
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center'
          // }}
        >
          −
        </button>
        <button
          className="h-12 cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-5 text-[13px] font-semibold text-gray-700"
          onClick={() => setCount(0)}
          // style={{
          //   padding: '0 20px',
          //   height: 48,
          //   fontSize: 13,
          //   borderRadius: 8,
          //   border: '1px solid #d1d5db',
          //   background: '#f3f4f6',
          //   color: '#374151',
          //   cursor: 'pointer',
          //   fontWeight: 600
          // }}
        >
          Reset
        </button>
        <button
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-green-300 bg-green-100 text-2xl font-bold text-green-600"
          onClick={() => setCount((c) => c + 1)}
          // style={{
          //   width: 48,
          //   height: 48,
          //   fontSize: 24,
          //   borderRadius: 8,
          //   border: '1px solid #86efac',
          //   background: '#dcfce7',
          //   color: '#16a34a',
          //   cursor: 'pointer',
          //   fontWeight: 700,
          //   display: 'flex',
          //   alignItems: 'center',
          //   justifyContent: 'center'
          // }}
        >
          +
        </button>
      </div>
    </div>
  );
}
