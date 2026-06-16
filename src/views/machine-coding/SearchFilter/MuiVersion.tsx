'use client';
/**
 * SEARCH FILTER — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same filter logic as PlainVersion — MUI components wrap the same pattern.
 */
import { useState } from 'react';
import { Box, TextField, Typography, List, ListItem, ListItemText, Paper, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useAutoAnimate } from 'ui-component/extended/AutoAnimate';

const ITEMS = [
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
  const [query, setQuery] = useState('');
  const [listRef] = useAutoAnimate<HTMLUListElement>();

  const filtered = ITEMS.filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  return (
    <Box sx={{ p: 2 }}>
      <TextField
        fullWidth
        placeholder="Search frameworks & libraries..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: query ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setQuery('')} edge="end">
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }}
        sx={{ mb: 1.5 }}
      />

      <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
        Showing <strong>{filtered.length}</strong> of {ITEMS.length} items
      </Typography>

      <Paper variant="outlined" sx={{ maxHeight: 280, overflowY: 'auto', borderRadius: 2 }}>
        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>
            <Typography variant="body2">No results for &ldquo;{query}&rdquo;</Typography>
          </Box>
        ) : (
          <List dense disablePadding ref={listRef}>
            {filtered.map((item, i) => (
              <ListItem key={item} divider={i < filtered.length - 1}>
                <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
