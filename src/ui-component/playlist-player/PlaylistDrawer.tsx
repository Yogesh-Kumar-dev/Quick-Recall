'use client';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { IconBrandYoutube, IconX } from '@tabler/icons-react';

import PlaylistPlayer from './PlaylistPlayer';

// Bottom drawer that hosts the playlist player. The player is mounted ONLY while the drawer is
// open, so closing it tears down the iframe and stops playback (no background audio).

interface PlaylistDrawerProps {
  open: boolean;
  onClose: () => void;
  playlists: string[];
  title?: string;
}

export default function PlaylistDrawer({ open, onClose, playlists, title = 'Related Videos' }: PlaylistDrawerProps) {
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
          <IconBrandYoutube size={22} style={{ color: '#FF0000' }} />
          <Typography variant="h4" fontWeight={700}>
            {title}
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose} aria-label="Close playlist player" edge="end">
          <IconX size={20} />
        </IconButton>
      </Box>

      {/* ── Body (player only while open) ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        {open && <PlaylistPlayer playlists={playlists} />}
      </Box>
    </Drawer>
  );
}
