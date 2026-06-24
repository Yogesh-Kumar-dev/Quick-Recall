'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PAGE_SIZE, type Quote } from './shared';

// Stable keys for the loading skeletons (they never reorder).
const SKELETON_KEYS = Array.from({ length: PAGE_SIZE }, (_, i) => `skeleton-${i}`);

interface QuoteListViewProps {
  quotes: Quote[] | undefined;
  total: number | undefined;
  page: number; // 0-based
  // First load with no data yet (TanStack isPending / RTK isLoading).
  isInitialLoading: boolean;
  // Any in-flight request, including background page changes (isFetching).
  isFetching: boolean;
  isError: boolean;
  onPrev: () => void;
  onNext: () => void;
  onRetry: () => void;
}

// Pure presentational quote list shared by BOTH demos. Keeping the chrome
// identical means the only visible difference between the TanStack and RTK
// Query variants is the implementation file below — not the UI.
export default function QuoteListView({
  quotes,
  total,
  page,
  isInitialLoading,
  isFetching,
  isError,
  onPrev,
  onNext,
  onRetry
}: QuoteListViewProps) {
  const totalPages = total ? Math.ceil(total / PAGE_SIZE) : undefined;
  const isLastPage = totalPages !== undefined && page >= totalPages - 1;

  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      >
        Failed to load quotes. Check your connection and retry.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Background refetch indicator — visible on page change while old data stays put */}
      <Box sx={{ height: 4, mb: 1 }}>{isFetching && !isInitialLoading && <LinearProgress />}</Box>

      <Stack spacing={1.5} sx={{ minHeight: PAGE_SIZE * 64 }}>
        {isInitialLoading
          ? SKELETON_KEYS.map((key) => <Skeleton key={key} variant="rounded" height={56} />)
          : quotes?.map((q) => (
              <Box key={q.id} sx={{ p: 1.5, borderRadius: 1, border: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5 }}>
                  “{q.quote}”
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  — {q.author}
                </Typography>
              </Box>
            ))}
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <Button variant="outlined" size="small" disabled={page === 0 || isInitialLoading} onClick={onPrev}>
          ← Prev
        </Button>
        <Typography variant="body2" color="text.secondary">
          {totalPages ? `Page ${page + 1} of ${totalPages}` : `Page ${page + 1}`}
        </Typography>
        <Button variant="outlined" size="small" disabled={isLastPage || isInitialLoading} onClick={onNext}>
          Next →
        </Button>
      </Stack>
    </Box>
  );
}
