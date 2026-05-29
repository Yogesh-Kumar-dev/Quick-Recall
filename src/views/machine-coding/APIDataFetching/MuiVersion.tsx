'use client';
/**
 * API DATA FETCHING — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same fetch pattern as PlainVersion — MUI Skeleton replaces the shimmer divs,
 * Alert replaces the error box, Card replaces the plain <li>.
 */
import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Chip,
  Skeleton,
  Stack,
  CircularProgress
} from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RefreshIcon from '@mui/icons-material/Refresh';

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export default function APIDataFetching() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  async function fetchPosts() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10');
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: Post[] = await res.json();
      setPosts(data);
      setFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            Posts
          </Typography>
          <Typography variant="caption" color="text.secondary">
            jsonplaceholder.typicode.com
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={fetchPosts}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : fetched ? <RefreshIcon /> : <CloudDownloadIcon />}
        >
          {loading ? 'Loading…' : fetched ? 'Refresh' : 'Fetch Posts'}
        </Button>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Skeletons */}
      {loading && (
        <Stack spacing={1.5}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={76} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      )}

      {/* Results */}
      {!loading && posts.length > 0 && (
        <Stack spacing={1.5}>
          {posts.map((post) => (
            <Card key={post.id} variant="outlined">
              <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box sx={{ display: 'flex', gap: 0.75, mb: 0.75, flexWrap: 'wrap' }}>
                  <Chip label={`#${post.id}`} size="small" color="primary" variant="outlined" />
                  <Chip label={`user ${post.userId}`} size="small" color="success" variant="outlined" />
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ textTransform: 'capitalize', mb: 0.5 }}
                >
                  {post.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" noWrap>
                  {post.body.substring(0, 90)}…
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* Empty state */}
      {!loading && !fetched && !error && (
        <Box sx={{ textAlign: 'center', color: 'text.disabled', py: 6 }}>
          <CloudDownloadIcon sx={{ fontSize: 40, mb: 1, opacity: 0.4 }} />
          <Typography variant="body2">Click &ldquo;Fetch Posts&rdquo; to load data from the API</Typography>
        </Box>
      )}
    </Box>
  );
}
