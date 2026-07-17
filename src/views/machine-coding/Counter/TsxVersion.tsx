'use client';
/**
 * COUNTER — TYPESCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same component, typed — Tailwind classes only, no inline styles.
 * Classic first React component: increment, decrement, reset.
 *
 * Key concepts: useState, event handlers, functional updates.
 */
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  const color: string = count > 0 ? 'text-green-600' : count < 0 ? 'text-red-600' : 'text-gray-500';
  const label: string = count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero';

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <h2 className="text-lg font-bold">Counter</h2>

      {/* Display */}
      <span className={`min-w-[160px] text-center text-6xl font-extrabold tabular-nums leading-none transition-colors duration-200 ${color}`}>
        {count}
      </span>

      {/* Status label */}
      <span className={`-mt-4 text-xs font-semibold uppercase tracking-[1.5px] ${color}`}>{label}</span>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setCount((c) => c - 1)}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-red-300 bg-red-100 text-2xl font-bold text-red-600"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setCount(0)}
          className="h-12 cursor-pointer rounded-lg border border-gray-300 bg-gray-100 px-5 text-[13px] font-semibold text-gray-700"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => c + 1)}
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-green-300 bg-green-100 text-2xl font-bold text-green-600"
        >
          +
        </button>
      </div>
    </div>
  );
}
