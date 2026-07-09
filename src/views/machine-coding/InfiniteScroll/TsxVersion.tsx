'use client';
/**
 * INFINITE SCROLL — PLAIN HTML VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Zero MUI. Same ref-based pattern. CSS spinner via keyframes.
 */
import { useState, useEffect, useRef } from 'react';

const PAGE_SIZE = 12;
const TOTAL_ITEMS = 60;

interface Item {
  id: number;
  title: string;
  description: string;
}

function generateItems(page: number): Item[] {
  const start = (page - 1) * PAGE_SIZE + 1;
  return Array.from({ length: PAGE_SIZE }, (_, i) => ({
    id: start + i,
    title: `Item #${start + i}`,
    description: `Loaded from page ${page}.`
  }));
}

function fetchItems(page: number): Promise<Item[]> {
  return new Promise((resolve) => setTimeout(() => resolve(generateItems(page)), 400 + Math.random() * 300));
}

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Refs to prevent stale closures in IntersectionObserver callback
  const pageRef = useRef<number>(1);
  const loadingRef = useRef<boolean>(false);
  const hasMoreRef = useRef<boolean>(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const newItems = await fetchItems(pageRef.current);
    setItems((prev) => [...prev, ...newItems]);

    if (pageRef.current * PAGE_SIZE >= TOTAL_ITEMS) {
      hasMoreRef.current = false;
      setHasMore(false);
    } else {
      pageRef.current += 1;
    }

    loadingRef.current = false;
    setLoading(false);
  };

  useEffect(() => {
    loadMore(); // initial fetch

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, []); // intentionally empty: loadMore uses refs internally, no stale-closure risk

  return (
    <div>
      <style>{`@keyframes mc-spin { to { transform: rotate(360deg); } }`}</style>

      <p style={{ fontSize: 14, color: '#666', marginBottom: 12 }}>
        {items.length} / {TOTAL_ITEMS} items loaded. Scroll inside the box.
      </p>

      <div
        style={{
          height: 500,
          overflowY: 'auto',
          border: '1px solid #e0e0e0',
          borderRadius: 8,
          padding: 12
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 10
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: 12,
                background: '#fff'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <strong style={{ fontSize: 13 }}>{item.title}</strong>
                <span style={{ fontSize: 11, background: '#e3f2fd', color: '#1976d2', padding: '1px 6px', borderRadius: 8 }}>
                  #{item.id}
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#888', margin: 0 }}>{item.description}</p>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
            <div
              style={{
                width: 28,
                height: 28,
                border: '3px solid #e0e0e0',
                borderTop: '3px solid #1976d2',
                borderRadius: '50%',
                animation: 'mc-spin 0.8s linear infinite'
              }}
            />
          </div>
        )}

        {!hasMore && (
          <p style={{ textAlign: 'center', fontSize: 14, color: '#999', padding: '12px 0' }}>All {TOTAL_ITEMS} items loaded.</p>
        )}

        {/* Sentinel */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </div>
    </div>
  );
}
