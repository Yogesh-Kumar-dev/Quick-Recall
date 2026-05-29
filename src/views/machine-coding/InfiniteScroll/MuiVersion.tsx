'use client';
/**
 * INFINITE SCROLL — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Core technique: IntersectionObserver on a sentinel element
 *
 * Why useRef for page/loading instead of useState?
 * The IntersectionObserver callback is created once (empty deps []).
 * If we read `loading` or `page` state inside it, we get a stale closure
 * (the values captured at the time the observer was created).
 * Solution: sync state changes to refs → refs are always up-to-date.
 *
 * Pattern:
 *   state    → drives the UI (re-renders)
 *   ref      → provides current value inside observer callback (no re-render)
 *
 * Data flow:
 * 1. Render sentinel <div ref={sentinelRef}> at bottom of list
 * 2. IntersectionObserver watches the sentinel
 * 3. Sentinel enters viewport → call loadMore()
 * 4. loadMore: fetch next page, append items, update page/hasMore
 * 5. When all data loaded: disconnect observer (hasMore = false)
 */
import { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';

// ── Mock data ─────────────────────────────────────────────────────────────────
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
    description: `Loaded from page ${page}. Index ${start + i} of ${TOTAL_ITEMS}.`
  }));
}

function fetchItems(page: number): Promise<Item[]> {
  return new Promise((resolve) => setTimeout(() => resolve(generateItems(page)), 400 + Math.random() * 300));
}

// ──────────────────────────────────────────────────────────────────────────────
export default function InfiniteScrollMui() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Refs mirror state — safe to read inside observer callbacks without stale closures
  const pageRef = useRef(1);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Load next page ────────────────────────────────────────────────────────────
  const loadMore = async () => {
    if (loadingRef.current || !hasMoreRef.current) return; // guards

    loadingRef.current = true;
    setLoading(true);

    const newItems = await fetchItems(pageRef.current);
    setItems((prev) => [...prev, ...newItems]);

    if (pageRef.current * PAGE_SIZE >= TOTAL_ITEMS) {
      // All data loaded — stop observing
      hasMoreRef.current = false;
      setHasMore(false);
    } else {
      pageRef.current += 1; // advance page ref
    }

    loadingRef.current = false;
    setLoading(false);
  };

  // ── Mount: initial load + set up IntersectionObserver ─────────────────────────
  useEffect(() => {
    loadMore(); // fetch page 1 on mount

    // Create observer once — no dependency array means no stale closure risk
    // because loadMore reads from refs, not state
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0] = our sentinel element
        if (entries[0].isIntersecting) {
          loadMore(); // safe: uses refs internally
        }
      },
      { threshold: 0.1 } // fire when 10% of sentinel is visible
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    // Cleanup: disconnect observer when component unmounts
    return () => observer.disconnect();
  }, []); // intentionally empty: loadMore uses refs internally, no stale-closure risk

  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {items.length} / {TOTAL_ITEMS} items loaded. Scroll down inside the box.
      </Typography>

      {/* Fixed-height scrollable container */}
      <Box
        sx={{
          height: 500,
          overflowY: 'auto',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 1.5
        }}
      >
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 1.5 }}>
          {items.map((item) => (
            <Card key={item.id} variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Chip label={`#${item.id}`} size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Loading indicator */}
        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={28} />
          </Box>
        )}

        {/* End of list */}
        {!hasMore && (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
            ✅ All {TOTAL_ITEMS} items loaded.
          </Typography>
        )}

        {/*
          SENTINEL ELEMENT
          ─────────────────
          This invisible 1px div sits at the bottom of the list.
          The IntersectionObserver fires when this enters the viewport.
          No visual impact; pure trigger mechanism.
        */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </Box>
    </Box>
  );
}
