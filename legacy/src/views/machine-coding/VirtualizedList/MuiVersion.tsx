'use client';
/**
 * VIRTUALIZED LIST — MUI VERSION (react-virtuoso windowing)
 * ──────────────────────────────────────────────────────────────────────────────
 * The alternative to "reveal on scroll": VIRTUALIZATION (a.k.a. windowing).
 *
 * react-virtuoso's <Virtuoso> renders ONLY the rows currently in (and just
 * around) the viewport. Scroll a 100-item — or 100,000-item — list and the DOM
 * still holds just a handful of rows. It recycles them as you scroll.
 *
 * Key difference from react-window: react-virtuoso measures each row's height
 * dynamically via ResizeObserver, so rows can have variable heights with no
 * manual bookkeeping. No `style` prop spreading required.
 *
 * The `components` prop lets you swap in MUI primitives (List, ListItem) so the
 * virtual scroller renders semantic HTML with MUI styling — pattern from the
 * official react-virtuoso + MUI integration guide.
 *
 * Compare with the JSX/TSX versions: there, every revealed "div N" stays mounted.
 * Here, open dev-tools and inspect the list — only the visible rows exist.
 */
import { forwardRef } from 'react';
import { Virtuoso, type VirtuosoProps } from 'react-virtuoso';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

const TOTAL = 100;
const LIST_HEIGHT = 460;

// ── MUI component overrides ──────────────────────────────────────────────────
// Passed to Virtuoso so it renders MUI List/ListItem instead of plain divs.
// The List must be a forwardRef so Virtuoso can attach its scroll ref.
const MUIComponents: VirtuosoProps<number, unknown>['components'] = {
  List: forwardRef(({ children, style }, ref) => (
    <List component="div" ref={ref} style={{ padding: 0, ...style, margin: 0 }}>
      {children}
    </List>
  )),
  Item: ({ children, ...props }) => (
    <ListItem component="div" {...props} sx={{ p: 0.5 }}>
      {children}
    </ListItem>
  )
};

// ── Row renderer ─────────────────────────────────────────────────────────────
function RowContent(index: number) {
  const n = index + 1;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        height: 48,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
        width: '100%'
      }}
    >
      <Typography variant="subtitle2" fontWeight={600}>
        div {n}
      </Typography>
      <Chip label={`#${n}`} size="small" color="primary" variant="outlined" sx={{ height: 18, fontSize: 10 }} />
    </Box>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
export default function VirtualizedListMui() {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={2}>
        All {TOTAL} divs are passed to react-virtuoso, but only the rows in view are mounted. Inspect the list in dev-tools while scrolling
        — the node count stays roughly constant.
      </Typography>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 1, height: LIST_HEIGHT }}>
        <Virtuoso totalCount={TOTAL} components={MUIComponents} itemContent={RowContent} style={{ height: '100%' }} />
      </Box>
    </Box>
  );
}
