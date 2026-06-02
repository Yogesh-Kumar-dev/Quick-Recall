'use client';
/**
 * VIRTUALIZED LIST — MUI VERSION (react-window windowing)
 * ──────────────────────────────────────────────────────────────────────────────
 * The alternative to "reveal on scroll": VIRTUALIZATION (a.k.a. windowing).
 *
 * react-window's <FixedSizeList> renders ONLY the rows currently in (and just
 * around) the viewport. Scroll a 100-item — or 100,000-item — list and the DOM
 * still holds just a handful of <div> rows. It recycles them as you scroll.
 *
 * Two requirements for fixed-size windowing:
 *   1. A known, constant row height (itemSize).
 *   2. The row renderer MUST spread the library-provided `style` onto its root
 *      element — react-window absolutely-positions each row via that style.
 *
 * Compare with the JSX/TSX versions: there, every revealed "div N" stays mounted.
 * Here, open dev-tools and inspect the list — only the visible rows exist.
 */
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';

const TOTAL = 100;
const ROW_HEIGHT = 56;
const LIST_HEIGHT = 460;

// ── Row renderer ────────────────────────────────────────────────────────────────
// `style` (position/top/height) is supplied by react-window and MUST be applied.
function Row({ index, style }: ListChildComponentProps) {
  const n = index + 1;
  return (
    <Box style={style} sx={{ px: 0.5, py: 0.5, boxSizing: 'border-box' }}>
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1.5,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          div {n}
        </Typography>
        <Chip label={`#${n}`} size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
      </Box>
    </Box>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
export default function VirtualizedListMui() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        All {TOTAL} divs are passed to react-window, but only the rows in view are mounted. Inspect the list in dev-tools while scrolling —
        the node count stays roughly constant.
      </Typography>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1 }}>
        <FixedSizeList height={LIST_HEIGHT} width="100%" itemSize={ROW_HEIGHT} itemCount={TOTAL} overscanCount={4}>
          {Row}
        </FixedSizeList>
      </Box>
    </Box>
  );
}
