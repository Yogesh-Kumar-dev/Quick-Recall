'use client';
/**
 * PRODUCT FILTER — JAVASCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Fetch products once, then filter the in-memory list by category + a debounced
 * search term. This is how you'd write it in a CodeSandbox / interview env.
 *
 * Pieces of state:
 *   - allProducts : the source list fetched once (never mutated)
 *   - category    : selected dropdown value ('All' = no filter)
 *   - search      : the raw, every-keystroke input value
 *   - debounced   : `search` mirrored after 300ms of no typing (drives filtering)
 *
 * The visible list is DERIVED from those — no separate "filteredProducts" state.
 * Deriving avoids the classic bug where two states drift out of sync.
 */
import { useState, useEffect, useMemo } from 'react';

const inputStyle = { padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 };

export default function ProductFilter() {
  const [allProducts, setAllProducts] = useState([]);
  // One state for the request lifecycle instead of parallel loading/error flags.
  // Shape: { status: 'loading' | 'success' | 'error', message? }
  const [request, setRequest] = useState({ status: 'loading' });

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

  // ── Fetch once on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      setRequest({ status: 'loading' });
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) {
          setAllProducts(data);
          setRequest({ status: 'success' });
        }
      } catch (err) {
        if (active) setRequest({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load' });
      }
    })();
    return () => {
      active = false; // ignore the response if we unmount mid-flight
    };
  }, []);

  // ── Debounce: copy `search` → `debounced` 300ms after typing stops ──────────
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id); // cancel the pending copy on every keystroke
  }, [search]);

  // ── Unique categories, derived from the data ────────────────────────────────
  const categories = useMemo(() => ['All', ...new Set(allProducts.map((p) => p.category))], [allProducts]);

  // ── The visible list: category + debounced search, derived (no extra state) ──
  const visible = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return allProducts.filter((p) => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = !q || p.title.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [allProducts, category, debounced]);

  return (
    <div style={{ padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, textTransform: 'capitalize' }}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {request.status === 'loading' && <p style={{ color: '#6b7280' }}>Loading…</p>}
      {request.status === 'error' && <p style={{ color: '#dc2626' }}>Error: {request.message}</p>}

      {request.status === 'success' && (
        <>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 12px' }}>{visible.length} products</p>

          {visible.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No products match your filters.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {visible.map((p) => (
                <div key={p.id} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                  <img src={p.image} alt={p.title} style={{ width: '100%', height: 120, objectFit: 'contain', marginBottom: 8 }} />
                  <div style={{ fontSize: 12, color: '#6b7280', textTransform: 'capitalize', marginBottom: 4 }}>{p.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{p.title}</div>
                  <div style={{ fontWeight: 700 }}>${p.price}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
