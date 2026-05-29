'use client';
/**
 * STAR RATING — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState } from 'react';

const LABELS = {
  0: 'Not rated',
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

// ── Reusable component ────────────────────────────────────────────────────────
function StarWidget({ value, onChange }) {
  const [hoverRating, setHoverRating] = useState(0);
  const activeCount = hoverRating || value;

  return (
    <div style={{ display: 'flex', gap: 4, cursor: 'pointer' }} onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <span
          key={starValue}
          onMouseEnter={() => setHoverRating(starValue)}
          onClick={() => onChange(starValue)}
          style={{
            fontSize: 36,
            color: activeCount >= starValue ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.15s, transform 0.1s',
            display: 'inline-block',
            lineHeight: 1,
            userSelect: 'none'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(1.3)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {activeCount >= starValue ? '★' : '☆'}
        </span>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
export default function StarRating() {
  const [rating, setRating] = useState(0);
  const [secondRating, setSecondRating] = useState(3);

  const cardStyle = {
    padding: 20,
    border: '1px solid #e0e0e0',
    borderRadius: 10,
    background: '#fff',
    maxWidth: 340,
    marginBottom: 16
  };

  return (
    <div>
      {/* Instance 1 */}
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, margin: '0 0 12px', fontSize: 15 }}>Rate this product</p>
        <StarWidget value={rating} onChange={setRating} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 12,
              background: rating > 0 ? '#fef3c7' : '#f5f5f5',
              color: rating > 0 ? '#b45309' : '#888',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            {rating}/5
          </span>
          <span style={{ fontSize: 14, color: '#666' }}>{LABELS[rating]}</span>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '12px 0' }} />
        <button
          onClick={() => setRating(0)}
          disabled={rating === 0}
          style={{
            padding: '5px 12px',
            border: '1px solid #ccc',
            borderRadius: 4,
            background: 'transparent',
            cursor: rating === 0 ? 'not-allowed' : 'pointer',
            fontSize: 13,
            color: rating === 0 ? '#bbb' : '#555'
          }}
        >
          Clear rating
        </button>
      </div>

      {/* Instance 2 — proves reusability */}
      <div style={cardStyle}>
        <p style={{ fontWeight: 600, margin: '0 0 12px', fontSize: 15 }}>Rate this course (pre-seeded: 3)</p>
        <StarWidget value={secondRating} onChange={setSecondRating} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          <span
            style={{
              padding: '2px 10px',
              borderRadius: 12,
              background: secondRating > 0 ? '#fef3c7' : '#f5f5f5',
              color: secondRating > 0 ? '#b45309' : '#888',
              fontSize: 13,
              fontWeight: 600
            }}
          >
            {secondRating}/5
          </span>
          <span style={{ fontSize: 14, color: '#666' }}>{LABELS[secondRating]}</span>
        </div>
      </div>
    </div>
  );
}
