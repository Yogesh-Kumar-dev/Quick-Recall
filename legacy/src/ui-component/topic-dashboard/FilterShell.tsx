'use client';
import { useState, type ReactNode } from 'react';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { IconFilter } from '@tabler/icons-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterShellProps {
  /** Content column (rendered full-width on mobile, beside the sidebar on desktop) */
  children: ReactNode;
  /** Desktop sticky sidebar JSX — hidden on mobile */
  sidebar: ReactNode;
  /** Mobile-only drawer, controlled by the FAB */
  renderDrawer: (open: boolean, onClose: () => void) => ReactNode;
  /** Number of active filters — shown as a badge on the FAB */
  activeFilterCount: number;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function FilterShell({ children, sidebar, renderDrawer, activeFilterCount }: FilterShellProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = useState(false);

  // ── Mobile: full-width content + floating filter FAB + drawer ──────────────
  if (isMobile) {
    return (
      <>
        <Box sx={{ minWidth: 0 }}>{children}</Box>

        <Badge
          badgeContent={activeFilterCount}
          color="error"
          overlap="circular"
          sx={{
            position: 'fixed',
            // sits above the theme-customization FAB (which lives at bottom: 32)
            bottom: 96,
            right: 32,
            zIndex: theme.zIndex.speedDial
          }}
        >
          <Fab color="primary" aria-label="Open filters" onClick={() => setOpen(true)} sx={{ boxShadow: theme.shadows[8] }}>
            <IconFilter size={22} />
          </Fab>
        </Badge>

        {/* Mount the drawer only while open — no need to keep its subtree in the DOM otherwise */}
        {open && renderDrawer(open, () => setOpen(false))}
      </>
    );
  }

  // ── Desktop: content + sticky sidebar (unchanged layout) ───────────────────
  return (
    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
      {sidebar}
    </Box>
  );
}
