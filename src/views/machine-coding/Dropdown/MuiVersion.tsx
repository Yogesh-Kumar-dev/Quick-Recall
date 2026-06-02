'use client';
/**
 * DROPDOWN — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Uses MUI Select (a controlled dropdown) — compare with PlainVersion to see
 * how MUI wraps the same pattern: isOpen + selected state.
 */
import { useState } from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Typography, Chip, SelectChangeEvent } from '@mui/material';

const OPTIONS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'];

export default function Dropdown() {
  const [selected, setSelected] = useState('');

  function handleChange(e: SelectChangeEvent) {
    setSelected(e.target.value);
  }

  return (
    <Box sx={{ p: 3 }}>
      <FormControl fullWidth sx={{ maxWidth: 280, mb: 2 }}>
        <InputLabel id="fruit-label">Select a fruit</InputLabel>
        <Select labelId="fruit-label" value={selected} label="Select a fruit" onChange={handleChange}>
          {OPTIONS.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selected ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            You selected:
          </Typography>
          <Chip label={selected} color="primary" size="small" onDelete={() => setSelected('')} />
        </Box>
      ) : (
        <Typography variant="body2" color="text.disabled">
          Nothing selected yet
        </Typography>
      )}
    </Box>
  );
}
