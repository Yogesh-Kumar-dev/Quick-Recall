'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconFileText, IconX } from '@tabler/icons-react';

import type { PdfGuide } from 'data/pdf-guides';
import PdfViewerPanel from './PdfViewerPanel';

// Bottom drawer that hosts the PDF viewer. The viewer is mounted ONLY while the drawer is open, so
// closing it tears down the PDFium engine/worker (no background work). Mirrors PlaylistDrawer.

interface PdfDrawerProps {
  open: boolean;
  onClose: () => void;
  guides: PdfGuide[];
  title?: string;
}

export default function PdfDrawer({ open, onClose, guides, title = 'PDF Guides' }: PdfDrawerProps) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { height: '100dvh', display: 'flex', flexDirection: 'column', borderRadius: 0, bgcolor: 'background.default' }
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconFileText size={22} style={{ color: 'var(--mui-palette-primary-main)' }} />
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} aria-label="Close PDF viewer" edge="end">
          <IconX size={20} />
        </IconButton>
      </Box>

      {/* ── Body (viewer only while open) ── */}
      <Box sx={{ flex: 1, minHeight: 0 }}>{open && <PdfViewerPanel guides={guides} />}</Box>
    </Drawer>
  );
}
