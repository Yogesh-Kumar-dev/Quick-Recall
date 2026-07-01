'use client';
/**
 * PRODUCT FILTER — TYPESCRIPT VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same logic as the JSX version, with a Product interface and typed state.
 * The visible list is DERIVED via useMemo from (allProducts, category, debounced)
 * — never stored in its own state, so the filters can never drift out of sync.
 */
import { useState, useEffect, useMemo, type ChangeEvent, type CSSProperties } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

// Discriminated union: the error message only exists in the 'error' case, so TS
// won't let you read it elsewhere. One state models the whole request lifecycle.
type RequestState = { status: 'loading' } | { status: 'success' } | { status: 'error'; message: string };

const inputStyle: CSSProperties = { padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db', fontSize: 14 };

export default function ProductFilter() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [request, setRequest] = useState<RequestState>({ status: 'loading' });

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
        const data: Product[] = await res.json();
        if (active) {
          setAllProducts(data);
          setRequest({ status: 'success' });
        }
      } catch (err) {
        if (active) setRequest({ status: 'error', message: err instanceof Error ? err.message : 'Failed to load' });
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // ── Debounce the search term (300ms) ────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(id);
  }, [search]);

  const categories = useMemo<string[]>(() => ['All', ...new Set(allProducts.map((p) => p.category))], [allProducts]);

  const visible = useMemo<Product[]>(() => {
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
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search products…"
          style={{ ...inputStyle, flex: 1, minWidth: 200 }}
        />
        <select
          value={category}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value)}
          style={{ ...inputStyle, textTransform: 'capitalize' }}
        >
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
