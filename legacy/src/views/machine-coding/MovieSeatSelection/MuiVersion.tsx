'use client';
/**
 * MOVIE SEAT SELECTION — MUI VERSION
 * ──────────────────────────────────────────────────────────────────────────────
 * Same state model, styled with MUI + theme palette.
 *
 *   booked   → Set<string> already taken (locked, non-interactive)
 *   selected → Set<string> picked by the user (toggle on click)
 * Count and total are DERIVED from `selected` inline — never stored in state.
 */
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
const COLS = 8;
const PRICE = 200; // ₹ per seat

const INITIAL_BOOKED = ['A3', 'A4', 'C5', 'D5', 'D6', 'F1'];

type SeatState = 'available' | 'selected' | 'booked';

export default function MovieSeatSelectionMui() {
  const theme = useTheme();
  const [booked, setBooked] = useState<Set<string>>(() => new Set(INITIAL_BOOKED));
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const toggleSeat = (id: string): void => {
    if (booked.has(id)) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const book = (): void => {
    if (selected.size === 0) return;
    setBooked((prev) => new Set([...prev, ...selected]));
    setSelected(new Set());
  };

  const stateOf = (id: string): SeatState => (booked.has(id) ? 'booked' : selected.has(id) ? 'selected' : 'available');

  const count = selected.size; // derived
  const total = count * PRICE; // derived

  const seatSx = (st: SeatState) => {
    if (st === 'selected') {
      return { bgcolor: 'primary.main', color: 'primary.contrastText', borderColor: 'primary.main' };
    }
    if (st === 'booked') {
      return { bgcolor: 'action.disabledBackground', color: 'text.disabled', borderColor: 'action.disabledBackground' };
    }
    return { bgcolor: 'background.paper', color: 'text.primary', borderColor: 'divider' };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 2 }}>
      {/* Screen */}
      <Box
        sx={{
          width: '80%',
          height: 8,
          borderRadius: 1,
          background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          boxShadow: `0 8px 20px -8px ${theme.palette.primary.main}`
        }}
      />
      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 4, textTransform: 'uppercase' }}>
        Screen this way
      </Typography>

      {/* Seat grid */}
      <Stack spacing={1}>
        {ROWS.map((row) => (
          <Stack key={row} direction="row" spacing={1} alignItems="center">
            <Typography sx={{ width: 16, fontSize: 12, fontWeight: 700 }} color="text.secondary">
              {row}
            </Typography>
            {Array.from({ length: COLS }, (_, c) => {
              const id = `${row}${c + 1}`;
              const st = stateOf(id);
              return (
                <Box
                  key={id}
                  component="button"
                  onClick={() => toggleSeat(id)}
                  disabled={st === 'booked'}
                  aria-label={`Seat ${id} ${st}`}
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: 1.5,
                    fontSize: 10,
                    border: '1px solid',
                    cursor: st === 'booked' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    ...seatSx(st)
                  }}
                >
                  {c + 1}
                </Box>
              );
            })}
          </Stack>
        ))}
      </Stack>

      {/* Legend */}
      <Stack direction="row" spacing={2}>
        {(['available', 'selected', 'booked'] as SeatState[]).map((st) => (
          <Stack key={st} direction="row" spacing={0.75} alignItems="center">
            <Box sx={{ width: 14, height: 14, borderRadius: 1, border: '1px solid', ...seatSx(st) }} />
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {st}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider flexItem />

      {/* Footer */}
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="subtitle1" fontWeight={600}>
          {count} {count === 1 ? 'seat' : 'seats'} · ₹{total}
        </Typography>
        <Button variant="contained" onClick={book} disabled={count === 0} sx={{ fontWeight: 700, px: 3 }}>
          Book
        </Button>
      </Stack>
    </Box>
  );
}
