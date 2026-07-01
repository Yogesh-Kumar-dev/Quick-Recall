'use client';
/**
 * DEBOUNCED SEARCH — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Custom hook: useDebounce<T>(value, delay) → returns the debounced value
 *
 * How debouncing works:
 * - Every time `value` changes, we start a new setTimeout
 * - If value changes AGAIN before delay ms, we cancel the old timer (clearTimeout)
 * - Only when value is stable for `delay` ms does debouncedValue update
 * - This fires the search effect far fewer times than on every keystroke
 */
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import { IconSearch, IconX } from '@tabler/icons-react';

// ── Mock dataset ───────────────────────────────────────────────────────────────
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

// ── Custom useDebounce hook ────────────────────────────────────────────────────
// Generic: works for any value type (string, number, etc.)
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Start a timer — if value doesn't change within `delay` ms, update debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CRITICAL: Cancel the previous timer when value changes before delay expires
    // This is what makes it a "debounce" — only the last timer fires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ──────────────────────────────────────────────────────────────────────────────
export default function DebouncedSearchMui() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // The debounced version of query — lags 400ms behind the real query
  const debouncedQuery = useDebounce(query, 400);

  // ── Effect: run search when debouncedQuery changes ──────────────────────────
  // This effect fires only when typing has stopped for 400ms
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Simulate async search with a short delay
    const timer = setTimeout(() => {
      const filtered = MOCK_DATA.filter((item) => item.toLowerCase().includes(debouncedQuery.toLowerCase()));
      setResults(filtered);
      setIsSearching(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [debouncedQuery]); // ← only depends on debouncedQuery, NOT raw query

  // Show searching indicator as soon as user types (before debounce fires)
  const isTyping = query !== debouncedQuery;

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
  };

  return (
    <Paper sx={{ p: 2.5, maxWidth: 520, borderRadius: 2 }} elevation={2}>
      {/* Search input */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search technologies... (e.g. React, Node, Docker)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {isTyping || isSearching ? <CircularProgress size={16} /> : <IconSearch size={16} />}
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={handleClear}>
                <IconX size={16} />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

      {/* Status line */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="caption" color="text.secondary">
          {isTyping
            ? 'Waiting for you to stop typing…'
            : isSearching
              ? 'Searching…'
              : debouncedQuery
                ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${debouncedQuery}"`
                : `${MOCK_DATA.length} items in dataset`}
        </Typography>
        {debouncedQuery && results.length > 0 && <Chip label={`${results.length} found`} size="small" color="success" variant="outlined" />}
      </Box>

      {/* Results */}
      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          maxHeight: 300,
          overflowY: 'auto'
        }}
      >
        {!debouncedQuery && (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            Start typing to search…
          </Typography>
        )}
        {debouncedQuery && !isSearching && results.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No results found for &quot;{debouncedQuery}&quot;
          </Typography>
        )}
        <List dense disablePadding>
          {results.map((item) => (
            <ListItem key={item} divider sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
              <ListItemText primary={item} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
}
