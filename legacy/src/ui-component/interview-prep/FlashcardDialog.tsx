'use client';
import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { AnimatePresence, motion } from 'framer-motion';
import { IconArrowLeft, IconArrowRight, IconArrowsShuffle, IconBrain, IconX } from '@tabler/icons-react';
import BookmarkButton from 'ui-component/interview-prep/BookmarkButton';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as reviewsRepository from 'views/review/reviewsRepository';
import type { Flashcard } from 'types/content';

// Slide the outgoing card out and the incoming card in, in the navigation direction.
// custom = +1 (forward) → new card enters from the right; -1 (back) → from the left.
const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 90 : -90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -90 : 90, opacity: 0 })
};

// Fisher–Yates shuffle of [0, 1, …, n-1]
function shuffledIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface FlashcardDialogProps {
  open: boolean;
  onClose: () => void;
  cards: Flashcard[];
  title?: string;
  /**
   * Maps a card to its namespaced refId (`${source}:${id}`). When provided, the header shows
   * a "save for review" star + an "add to SRS" button for the current card. Callers that don't
   * have the aggregator can omit this — the dialog stays exactly as before.
   */
  getKey?: (card: Flashcard) => string;
}

export default function FlashcardDialog({ open, onClose, cards, title, getKey }: FlashcardDialogProps) {
  if (cards.length === 0) return null;

  return (
    <Dialog
      open={open}
      // Don't close mid-review on a stray backdrop click; the X button (and Esc) still close.
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') onClose();
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          overflow: 'hidden'
        }
      }}
    >
      {/*
        Mount the body only while open, keyed on `open`, so each open starts from the state
        initializers below (natural order, first card, front-side up) instead of resetting that
        state in an effect after the prop changes — which would flash the previous session's card
        for one render. Key-based reset is the canonical fix for adjusting-state-on-prop-change.
      */}
      {open && <FlashcardDialogBody key="open" cards={cards} title={title} getKey={getKey} onClose={onClose} />}
    </Dialog>
  );
}

// ─── The actual flashcard UI + its session state ─────────────────────────────
// Only rendered while the dialog is open. Because the parent keys this on `open`, every open is a
// fresh mount, so the useState initializers below are the single source of the "reset" behaviour.

type FlashcardDialogBodyProps = Required<Pick<FlashcardDialogProps, 'cards' | 'onClose'>> & Pick<FlashcardDialogProps, 'title' | 'getKey'>;

function FlashcardDialogBody({ cards, title, getKey, onClose }: FlashcardDialogBodyProps) {
  const total = cards.length;
  const dispatch = useDispatch();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: total }, (_, i) => i));
  const [isShuffled, setIsShuffled] = useState(false);
  // +1 = moving forward (new card slides in from the right), -1 = moving back
  const [direction, setDirection] = useState(1);

  const card = cards[order[index] ?? index];

  const shuffle = useCallback(() => {
    setDirection(1);
    setOrder(shuffledIndices(total));
    setIsShuffled(true);
    setIndex(0);
    setFlipped(false);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i > 0 ? i - 1 : i));
    setFlipped(false);
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i < total - 1 ? i + 1 : i));
    setFlipped(false);
  }, [total]);

  const toggleFlip = useCallback(() => setFlipped((f) => !f), []);

  // Current card's refId (when the caller wired up `getKey`), powering the save + enroll actions.
  const currentKey = getKey && card ? getKey(card) : null;

  const enrollCurrent = useCallback(async () => {
    if (!currentKey) return;
    try {
      await reviewsRepository.enroll(currentKey);
      dispatch(openSnackbar({ open: true, message: 'Added to review.', variant: 'alert', alert: { color: 'success' }, close: false }));
    } catch {
      dispatch(
        openSnackbar({ open: true, message: 'Could not add to review.', variant: 'alert', alert: { color: 'error' }, close: false })
      );
    }
  }, [currentKey, dispatch]);

  // Keyboard: ←/→ navigate, Space/Enter flips. The body only mounts while the dialog is open, so
  // no `open` guard is needed — the listener is added on mount and removed on close (unmount).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggleFlip();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        shuffle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, toggleFlip, shuffle]);

  return (
    <>
      {/* ── Header: counter + close ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
          {index + 1} / {total}
          {title ? ` · ${title}` : ''}
          {isShuffled ? ' · Shuffled' : ''}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {currentKey && (
            <>
              <BookmarkButton kind="flashcard" refId={currentKey} />
              <Tooltip title="Add to spaced-repetition review">
                <IconButton size="small" onClick={enrollCurrent} aria-label="Add this card to review">
                  <IconBrain size={18} />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Shuffle (S)">
            <IconButton size="small" onClick={shuffle} aria-label="Shuffle flashcards" color={isShuffled ? 'primary' : 'default'}>
              <IconArrowsShuffle size={18} />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={onClose} aria-label="Close flashcards">
            <IconX size={18} />
          </IconButton>
        </Stack>
      </Stack>

      {/* ── Card (click to flip; slides left/right on navigate) ── */}
      <Box sx={{ px: 2.5, pb: 1, overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            <Box
              role="button"
              tabIndex={0}
              onClick={toggleFlip}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  toggleFlip();
                }
              }}
              sx={{ perspective: '1200px', cursor: 'pointer', outline: 'none' }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 260,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.5s cubic-bezier(0.4, 0.2, 0.2, 1)',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front */}
                <FlashcardFace>
                  {card.category && (
                    <Chip
                      label={card.category}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ position: 'absolute', top: 16, left: 16, height: 22, fontSize: 11 }}
                    />
                  )}
                  <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.35 }}>
                    {card.front}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 16 }}>
                    Click to flip
                  </Typography>
                </FlashcardFace>

                {/* Back */}
                <FlashcardFace back>
                  <Typography variant="h5" sx={{ lineHeight: 1.5, fontWeight: 500 }}>
                    {card.back}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ position: 'absolute', bottom: 16 }}>
                    Click to flip back
                  </Typography>
                </FlashcardFace>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* ── Nav ── */}
      <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ py: 2 }}>
        <IconButton onClick={goPrev} disabled={index === 0} aria-label="Previous card" sx={{ border: '1px solid', borderColor: 'divider' }}>
          <IconArrowLeft size={20} />
        </IconButton>
        <IconButton
          onClick={goNext}
          disabled={index === total - 1}
          aria-label="Next card"
          sx={{ border: '1px solid', borderColor: 'divider' }}
        >
          <IconArrowRight size={20} />
        </IconButton>
      </Stack>
    </>
  );
}

// ─── A single 3D card face (front or back) ────────────────────────────────────

function FlashcardFace({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
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
