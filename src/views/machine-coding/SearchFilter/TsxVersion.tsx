'use client';
/**
 * SEARCH FILTER — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Filters a static list in real-time as the user types.
 * No debounce — filtering is synchronous (cheap for small lists).
 *
 * Key: filtered = items.filter(i => i.toLowerCase().includes(query.toLowerCase()))
 */
import { useState } from 'react';

const ITEMS: string[] = [
  'React',
  'Vue',
  'Angular',
  'Svelte',
  'Solid',
  'Next.js',
  'Nuxt',
  'Remix',
  'Astro',
  'Vite',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Deno',
  'Bun',
  'Tailwind CSS',
  'MUI',
  'Chakra UI',
  'Ant Design',
  'Bootstrap'
];

export default function SearchFilter() {
  const [query, setQuery] = useState<string>('');

  const filtered: string[] = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ padding: 24 }}>
      {/* Search input */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: 16,
            pointerEvents: 'none'
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="Search frameworks & libraries..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 36px',
            fontSize: 14,
            borderRadius: 8,
            border: '1px solid #d1d5db',
            boxSizing: 'border-box',
            outline: 'none'
          }}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9ca3af',
              fontSize: 16,
              lineHeight: 1
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Count */}
      <p style={{ margin: '0 0 10px', color: '#6b7280', fontSize: 12 }}>
        Showing <strong>{filtered.length}</strong> of {ITEMS.length} items
      </p>

      {/* Results list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 32, color: '#9ca3af' }}>
          <div style={{ fontSize: 32 }}>🔍</div>
          <p style={{ margin: '8px 0 0', fontSize: 14 }}>No results for &ldquo;{query}&rdquo;</p>
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            maxHeight: 280,
            overflowY: 'auto'
          }}
        >
          {filtered.map((item) => (
            <li
              key={item}
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                fontSize: 14,
                color: '#111827'
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
