'use client';
/**
 * MOVIE SEAT SELECTION — TYPESCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same logic as the JSX version, with explicit types.
 *
 * State model:
 *   booked   → Set<string> of seat ids already taken (non-interactive)
 *   selected → Set<string> of seat ids the user has picked (toggle on click)
 * Count and total price are DERIVED from `selected` during render — not stored.
 */
import { useState } from 'react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const COLS = 8;
const PRICE = 200; // ₹ per seat

const INITIAL_BOOKED = ['A3', 'A4', 'C5', 'D5', 'D6', 'F1'];

type SeatState = 'available' | 'selected' | 'booked';

const SEAT_COLORS: Record<SeatState, { bg: string; border: string; color: string }> = {
  available: { bg: '#fff', border: '#bdbdbd', color: '#333' },
  selected: { bg: '#1976d2', border: '#1976d2', color: '#fff' },
  booked: { bg: '#e0e0e0', border: '#e0e0e0', color: '#9e9e9e' }
};

export default function MovieSeatSelection() {
  const [booked, setBooked] = useState<Set<string>>(() => new Set(INITIAL_BOOKED));
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const toggleSeat = (id: string): void => {
    if (booked.has(id)) return; // booked seats are locked
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const book = (): void => {
    if (selected.size === 0) return;
    setBooked((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
  };

  const stateOf = (id: string): SeatState => (booked.has(id) ? 'booked' : selected.has(id) ? 'selected' : 'available');

  const count = selected.size; // derived
  const total = count * PRICE; // derived

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 16 }}>
      {/* Screen */}
      <div
        style={{
          width: '80%',
          height: 8,
          borderRadius: 4,
          background: 'linear-gradient(#1976d2, #bbdefb)',
          boxShadow: '0 8px 20px -8px #1976d2'
        }}
      />
      <span style={{ fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase' }}>Screen this way</span>

      {/* Seat grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ROWS.map((row) => (
          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 16, fontSize: 12, fontWeight: 700, color: '#777' }}>{row}</span>
            {Array.from({ length: COLS }, (_, c) => {
              const id = `${row}${c + 1}`;
              const st = stateOf(id);
              const palette = SEAT_COLORS[st];
              return (
                <button
                  key={id}
                  onClick={() => toggleSeat(id)}
                  disabled={st === 'booked'}
                  aria-label={`Seat ${id} ${st}`}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    fontSize: 10,
                    cursor: st === 'booked' ? 'not-allowed' : 'pointer',
                    background: palette.bg,
                    border: `1px solid ${palette.border}`,
                    color: palette.color,
                    transition: 'all 0.15s'
                  }}
                >
                  {c + 1}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#666' }}>
        {(['available', 'selected', 'booked'] as SeatState[]).map((st) => (
          <span key={st} style={{ display: 'flex', alignItems: 'center', gap: 6, textTransform: 'capitalize' }}>
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: SEAT_COLORS[st].bg,
                border: `1px solid ${SEAT_COLORS[st].border}`
              }}
            />
            {st}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>
          {count} {count === 1 ? 'seat' : 'seats'} · ₹{total}
        </span>
        <button
          onClick={book}
          disabled={count === 0}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            fontWeight: 700,
            fontSize: 14,
            cursor: count === 0 ? 'not-allowed' : 'pointer',
            background: count === 0 ? '#e0e0e0' : '#1976d2',
            color: count === 0 ? '#9e9e9e' : '#fff'
          }}
        >
          Book
        </button>
      </div>
    </div>
  );
}
