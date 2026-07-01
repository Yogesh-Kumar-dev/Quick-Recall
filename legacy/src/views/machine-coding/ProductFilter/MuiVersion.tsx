'use client';
/**
 * PRODUCT FILTER — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same fetch + derived-filtering logic as the TSX version, with MUI components.
 */
import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

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

export default function ProductFilter() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [request, setRequest] = useState<RequestState>({ status: 'loading' });

  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');

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
    <Box sx={{ p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          sx={{ flex: 1, minWidth: 200 }}
        />
        <TextField
          select
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 180, textTransform: 'capitalize' }}
        >
          {categories.map((c) => (
            <MenuItem key={c} value={c} sx={{ textTransform: 'capitalize' }}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {request.status === 'loading' && <Typography color="text.secondary">Loading…</Typography>}
      {request.status === 'error' && <Typography color="error">Error: {request.message}</Typography>}

      {request.status === 'success' && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {visible.length} products
          </Typography>

          {visible.length === 0 ? (
            <Typography color="text.disabled">No products match your filters.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 1.5 }}>
              {visible.map((p) => (
                <Card key={p.id} variant="outlined">
                  <CardMedia component="img" image={p.image} alt={p.title} sx={{ height: 120, objectFit: 'contain', p: 1.5 }} />
                  <CardContent sx={{ pt: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize', display: 'block' }}>
                      {p.category}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.3, mb: 0.5 }}>
                      {p.title}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      ${p.price}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
