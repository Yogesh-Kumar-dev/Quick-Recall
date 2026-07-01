'use client';
/**
 * DEBOUNCED SEARCH — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * React without TypeScript — plain JS syntax, no type annotations.
 * This is how you'd write it in a CodeSandbox or interview environment.
 */
import { useState, useEffect } from 'react';

const MOCK_DATA = [
  'React',
  'Redux',
  'React Router',
  'React Query',
  'React Hook Form',
  'Next.js',
  'Node.js',
  'Express',
  'NestJS',
  'Fastify',
  'TypeScript',
  'JavaScript',
  'Python',
  'Go',
  'Rust',
  'Tailwind CSS',
  'Material UI',
  'Styled Components',
  'Sass',
  'CSS Modules',
  'GraphQL',
  'REST API',
  'WebSockets',
  'gRPC',
  'tRPC',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'Redis',
  'SQLite',
  'Docker',
  'Kubernetes',
  'AWS',
  'Vercel',
  'Netlify',
  'Jest',
  'Vitest',
  'Playwright',
  'Cypress',
  'Testing Library',
  'Webpack',
  'Vite',
  'Rollup',
  'Parcel',
  'esbuild',
  'Git',
  'GitHub Actions',
  'Zustand',
  'Jotai',
  'Recoil'
];

// ── useDebounce hook ────────────────────────────────────────────────────────────
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ──────────────────────────────────────────────────────────────────────────────
export default function DebouncedSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, 400);
  const isTyping = query !== debouncedQuery;

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      const filtered = MOCK_DATA.filter((item) => item.toLowerCase().includes(debouncedQuery.toLowerCase()));
      setResults(filtered);
      setIsSearching(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [debouncedQuery]);

  return (
    <div style={{ maxWidth: 480 }}>
      <style>{`@keyframes mc-spin { to { transform: rotate(360deg); } }`}</style>

      <div style={{ position: 'relative', marginBottom: 12 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
          {isTyping || isSearching ? (
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 14,
                border: '2px solid #e0e0e0',
                borderTop: '2px solid #1976d2',
                borderRadius: '50%',
                animation: 'mc-spin 0.8s linear infinite'
              }}
            />
          ) : (
            '🔍'
          )}
        </span>
        <input
          style={{
            width: '100%',
            padding: '9px 36px 9px 34px',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box'
          }}
          placeholder="Search technologies… (e.g. React, Docker)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
            }}
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#999',
              fontSize: 16,
              lineHeight: 1
            }}
          >
            ✕
          </button>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#888', margin: '0 0 8px' }}>
        {isTyping
          ? 'Waiting for you to stop typing…'
          : isSearching
            ? 'Searching…'
            : debouncedQuery
              ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
              : `${MOCK_DATA.length} items in dataset`}
      </p>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: 6, maxHeight: 280, overflowY: 'auto' }}>
        {!debouncedQuery && <p style={{ textAlign: 'center', color: '#bbb', fontSize: 14, padding: '24px 0' }}>Start typing to search…</p>}
        {debouncedQuery && !isSearching && results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: 14, padding: '24px 0' }}>No results for &quot;{debouncedQuery}&quot;</p>
        )}
        {results.map((item) => (
          <div
            key={item}
            style={{ padding: '10px 14px', borderBottom: '1px solid #f5f5f5', fontSize: 14, cursor: 'pointer' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f5f5')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
