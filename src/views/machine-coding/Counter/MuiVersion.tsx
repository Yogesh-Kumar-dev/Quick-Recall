'use client';
/**
 * COUNTER — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same logic as PlainVersion — compare to see how MUI wraps native elements.
 */
import { useState } from 'react';
import { Box, Button, Typography, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function Counter() {
  const [count, setCount] = useState(0);

  const chipColor = count > 0 ? 'success' : count < 0 ? 'error' : 'default';
  const label = count > 0 ? 'Positive' : count < 0 ? 'Negative' : 'Zero';
  const countColor = count > 0 ? 'success.main' : count < 0 ? 'error.main' : 'text.secondary';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 4 }}>
      <Typography variant="h6" fontWeight={700}>
        Counter
      </Typography>

      {/* Display */}
      <Typography
        variant="h1"
        sx={{
          fontSize: 88,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: countColor,
          lineHeight: 1,
          transition: 'color 0.25s'
        }}
      >
        {count}
      </Typography>

      <Chip
        label={label}
        color={chipColor as 'success' | 'error' | 'default'}
        size="small"
        sx={{ mt: -1.5 }}
      />

      {/* Controls */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<RemoveIcon />}
          onClick={() => setCount((c) => c - 1)}
          sx={{ minWidth: 130 }}
        >
          Decrement
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => setCount(0)}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          color="success"
          endIcon={<AddIcon />}
          onClick={() => setCount((c) => c + 1)}
          sx={{ minWidth: 130 }}
        >
          Increment
        </Button>
      </Box>
    </Box>
  );
}
