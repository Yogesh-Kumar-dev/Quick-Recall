'use client';

import { useCallback, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
import MuiLink from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrain, IconChecks } from '@tabler/icons-react';
import Link from 'next/link';

import useReviews from './useReviews';
import { review as previewSchedule, formatInterval, formatDuePhrase } from './scheduler';
import { flashcardByKey } from 'data/flashcards-index';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import type { ReviewQuality, ReviewState } from 'types/study';

// ==============================|| SRS REVIEW SESSION ||============================== //

// Three states: landing ("N due" → Start), in-session (flip + rate), done ("all caught up").
// The deck is a FROZEN snapshot of the due cards' full scheduling state taken at Start, so
// rating a card (which pushes its dueAt into the future and removes it from the live `due`
// query) doesn't reshuffle the session under the user. We simply walk the snapshot to the end.
// Keeping the full ReviewState (not just refIds) lets us PREVIEW each rating's next interval on
// the buttons, so the user sees when a card will resurface before choosing.

const RATINGS: { quality: ReviewQuality; label: string; color: 'error' | 'warning' | 'success' | 'primary' }[] = [
  { quality: 'again', label: 'Again', color: 'error' },
  { quality: 'hard', label: 'Hard', color: 'warning' },
  { quality: 'good', label: 'Good', color: 'success' },
  { quality: 'easy', label: 'Easy', color: 'primary' }
];

export default function ReviewPage() {
  const { due, dueCount, enrolledCount, loading, rate } = useReviews();
  const dispatch = useDispatch();

  const [deck, setDeck] = useState<ReviewState[] | null>(null); // frozen snapshot; null = not started
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const start = useCallback(() => {
    setDeck(due);
    setPos(0);
    setRevealed(false);
  }, [due]);

  const handleRate = useCallback(
    async (quality: ReviewQuality) => {
      if (!deck) return;
      const next = await rate(deck[pos].refId, quality);
      // Tell the user when they'll see this card again, so the scheduling is visible — not hidden.
      if (next) {
        dispatch(
          openSnackbar({
            open: true,
            message: `Got it — back ${formatDuePhrase(next.intervalMinutes)}.`,
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      }
      setRevealed(false);
      setPos((p) => p + 1);
    },
    [deck, pos, rate, dispatch]
  );

  const reset = useCallback(() => {
    setDeck(null);
    setPos(0);
    setRevealed(false);
  }, []);

  // ─── Landing ──────────────────────────────────────────────────────────────
  if (deck === null) {
    return (
      <Box>
        <Header />
        {loading ? null : dueCount === 0 ? (
          <CaughtUp enrolledCount={enrolledCount} />
        ) : (
          <Card variant="outlined" sx={{ borderRadius: 3, p: 5, textAlign: 'center' }}>
            <IconBrain size={48} style={{ opacity: 0.5 }} />
            <Typography variant="h3" fontWeight={700} sx={{ mt: 2 }}>
              {dueCount} {dueCount === 1 ? 'card' : 'cards'} due
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {enrolledCount} card{enrolledCount === 1 ? '' : 's'} in your review deck.
            </Typography>
            <Button variant="contained" size="large" onClick={start} sx={{ mt: 3 }}>
              Start review
            </Button>
          </Card>
        )}
      </Box>
    );
  }

  // ─── Done ─────────────────────────────────────────────────────────────────
  if (pos >= deck.length) {
    return (
      <Box>
        <Header />
        <Card variant="outlined" sx={{ borderRadius: 3, p: 5, textAlign: 'center' }}>
          <IconChecks size={48} style={{ opacity: 0.6 }} color="var(--mui-palette-success-main)" />
          <Typography variant="h3" fontWeight={700} sx={{ mt: 2 }}>
            Session complete
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            You reviewed {deck.length} {deck.length === 1 ? 'card' : 'cards'}. Nice work.
          </Typography>
          <Button variant="outlined" onClick={reset} sx={{ mt: 3 }}>
            Back to review
          </Button>
        </Card>
      </Box>
    );
  }

  // ─── In session ───────────────────────────────────────────────────────────
  const current = deck[pos];
  const indexed = flashcardByKey.get(current.refId);

  // A card may have been removed from content since enrollment — skip it gracefully.
  if (!indexed) {
    return (
      <Box>
        <Header />
        <Card variant="outlined" sx={{ borderRadius: 3, p: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This card is no longer available.
          </Typography>
          <Button variant="outlined" onClick={() => setPos((p) => p + 1)} sx={{ mt: 2 }}>
            Skip
          </Button>
        </Card>
      </Box>
    );
  }

  const progress = (pos / deck.length) * 100;

  return (
    <Box>
      <Header />
      <LinearProgress variant="determinate" value={progress} sx={{ borderRadius: 1, mb: 2 }} />
      <Typography variant="caption" color="text.secondary">
        Card {pos + 1} of {deck.length}
      </Typography>

      <FlipCard front={indexed.card.front} back={indexed.card.back} revealed={revealed} onFlip={() => setRevealed((r) => !r)} />

      {!revealed ? (
        <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
          <Button variant="contained" size="large" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mt: 3 }}>
          {RATINGS.map((r) => {
            // Preview where this rating sends the card, using the same pure scheduler that
            // persists on click — so the label shows exactly when the card will come back.
            const preview = previewSchedule(current, r.quality, Date.now());
            return (
              <Button
                key={r.quality}
                variant="outlined"
                color={r.color}
                size="large"
                onClick={() => handleRate(r.quality)}
                sx={{ flexDirection: 'column', lineHeight: 1.2, py: 1 }}
              >
                {r.label}
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {formatInterval(preview.intervalMinutes)}
                </Typography>
              </Button>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Review
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Practice the flashcards you&apos;ve added using <strong>spaced repetition</strong> — a proven study method that shows each card
        right before you&apos;d forget it, stretching the gap longer every time you recall it. Rate each card honestly and it schedules
        itself.{' '}
        <MuiLink href="https://apps.ankiweb.net/" target="_blank" rel="noopener noreferrer">
          Learn more
        </MuiLink>
        .
      </Typography>
    </Box>
  );
}

function CaughtUp({ enrolledCount }: { enrolledCount: number }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, p: 5, textAlign: 'center', borderStyle: 'dashed' }}>
      <IconChecks size={48} style={{ opacity: 0.4 }} />
      <Typography variant="h5" fontWeight={700} sx={{ mt: 2 }}>
        All caught up
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 420, mx: 'auto' }}>
        {enrolledCount === 0
          ? 'Your review deck is empty. Open a flashcard set and use the brain icon (or bookmark a card) to add cards here.'
          : `No cards are due right now. ${enrolledCount} card${enrolledCount === 1 ? '' : 's'} enrolled — check back later.`}
      </Typography>
      {enrolledCount === 0 && (
        <Button component={Link} href="/js/notes" variant="outlined" sx={{ mt: 3 }}>
          Browse flashcards
        </Button>
      )}
    </Card>
  );
}

// 3D flip card mirroring the FlashcardDialog look, controlled by the session.
function FlipCard({ front, back, revealed, onFlip }: { front: string; back: string; revealed: boolean; onFlip: () => void }) {
  return (
    <Box
      role="button"
      tabIndex={0}
      onClick={onFlip}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onFlip();
        }
      }}
      sx={{ perspective: '1200px', cursor: 'pointer', outline: 'none', mt: 1.5 }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: 280,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        <Face>
          <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.35 }}>
            {front}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 16 }}>
            Click to flip
          </Typography>
        </Face>
        <Face back>
          <Typography variant="h5" sx={{ lineHeight: 1.5, fontWeight: 500 }}>
            {back}
          </Typography>
        </Face>
      </Box>
    </Box>
  );
}

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
        overflowY: 'auto',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: back ? 'rotateY(180deg)' : 'none'
      }}
    >
      {children}
    </Box>
  );
}
