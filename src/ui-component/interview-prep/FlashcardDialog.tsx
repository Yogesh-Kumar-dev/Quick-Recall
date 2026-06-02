'use client';
import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { IconArrowLeft, IconArrowRight, IconArrowsShuffle, IconX } from '@tabler/icons-react';
import type { Flashcard } from 'types/content';

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
}

export default function FlashcardDialog({ open, onClose, cards, title }: FlashcardDialogProps) {
  const total = cards.length;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [order, setOrder] = useState<number[]>(() => Array.from({ length: total }, (_, i) => i));
  const [isShuffled, setIsShuffled] = useState(false);

  // Reset to natural order, first card, front-side up, each time the dialog opens
  useEffect(() => {
    if (open) {
      setOrder(Array.from({ length: total }, (_, i) => i));
      setIsShuffled(false);
      setIndex(0);
      setFlipped(false);
    }
  }, [open, total]);

  const card = cards[order[index] ?? index];

  const shuffle = useCallback(() => {
    setOrder(shuffledIndices(total));
    setIsShuffled(true);
    setIndex(0);
    setFlipped(false);
  }, [total]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i));
    setFlipped(false);
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i < total - 1 ? i + 1 : i));
    setFlipped(false);
  }, [total]);

  const toggleFlip = useCallback(() => setFlipped((f) => !f), []);

  // Keyboard: ←/→ navigate, Space/Enter flips
  useEffect(() => {
    if (!open) return;
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
  }, [open, goPrev, goNext, toggleFlip, shuffle]);

  if (total === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      {/* ── Header: counter + close ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 2.5, pt: 2, pb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
          {index + 1} / {total}
          {title ? ` · ${title}` : ''}
          {isShuffled ? ' · Shuffled' : ''}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center">
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

      {/* ── Card (click to flip) ── */}
      <Box sx={{ px: 2.5, pb: 1 }}>
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
    </Dialog>
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
