'use client';
/**
 * STAR RATING — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Key insight: Two state values control the display:
 *   - `rating`      → the committed (clicked) rating (0–5)
 *   - `hoverRating` → the preview rating while mouse is over a star (0 = no hover)
 *
 * Active star count = hoverRating || rating
 * (Use hoverRating if user is hovering, otherwise fall back to rating)
 *
 * onMouseLeave on the CONTAINER (not individual stars) resets hoverRating → 0
 * This is cleaner than attaching it to every star.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { IconStar, IconStarFilled } from '@tabler/icons-react';

// ── Rating labels ─────────────────────────────────────────────────────────────
const LABELS: Record<number, string> = {
  0: 'Not rated',
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

// ── Reusable StarRating component ─────────────────────────────────────────────
// In an interview, extract this as its own component with props:
// { value, onChange, size?, readOnly? }
function StarRatingControl({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hoverRating, setHoverRating] = useState(0);

  // The "active" count: prefer hoverRating, fall back to committed value
  const activeCount = hoverRating || value;

  return (
    // onMouseLeave on container → resets hover state when mouse leaves the whole widget
    <Box display="flex" gap={0.5} onMouseLeave={() => setHoverRating(0)}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1; // stars are 1-indexed
        const isFilled = activeCount >= starValue;

        return (
          <IconButton
            key={starValue}
            size="small"
            onMouseEnter={() => setHoverRating(starValue)} // preview
            onClick={() => onChange(starValue)} // commit
            sx={{
              color: isFilled ? '#f59e0b' : 'text.disabled',
              transition: 'color 0.15s, transform 0.1s',
              '&:hover': { transform: 'scale(1.2)', background: 'transparent' }
            }}
          >
            {isFilled ? <IconStarFilled size={32} /> : <IconStar size={32} />}
          </IconButton>
        );
      })}
    </Box>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
export default function StarRatingMui() {
  const [rating, setRating] = useState(0);

  // Demonstrate reusability: two independent instances
  const [secondRating, setSecondRating] = useState(3);

  return (
    <Stack spacing={3} maxWidth={400}>
      {/* Instance 1: fresh rating */}
      <Paper sx={{ p: 2.5, borderRadius: 2 }} elevation={2}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Rate this product
        </Typography>

        <StarRatingControl value={rating} onChange={setRating} />

        <Box mt={1.5} display="flex" alignItems="center" gap={1.5}>
          <Chip label={`${rating}/5`} color={rating > 0 ? 'warning' : 'default'} variant="filled" size="small" />
          <Typography variant="body2" color="text.secondary">
            {LABELS[rating]}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Button size="small" variant="outlined" color="inherit" onClick={() => setRating(0)} disabled={rating === 0}>
          Clear rating
        </Button>
      </Paper>

      {/* Instance 2: pre-seeded rating — proves the component is reusable */}
      <Paper sx={{ p: 2.5, borderRadius: 2 }} elevation={2}>
        <Typography variant="subtitle1" fontWeight={600} mb={1}>
          Rate this course (pre-seeded: 3)
        </Typography>

        <StarRatingControl value={secondRating} onChange={setSecondRating} />

        <Box mt={1.5} display="flex" alignItems="center" gap={1.5}>
          <Chip label={`${secondRating}/5`} color={secondRating > 0 ? 'warning' : 'default'} variant="filled" size="small" />
          <Typography variant="body2" color="text.secondary">
            {LABELS[secondRating]}
          </Typography>
        </Box>
      </Paper>
    </Stack>
  );
}
