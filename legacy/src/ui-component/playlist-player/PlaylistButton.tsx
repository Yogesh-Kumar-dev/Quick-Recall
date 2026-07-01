'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IconBrandYoutube } from '@tabler/icons-react';

// A small icon button that opens the playlist player. Mirrors the ReduxDevToolsHint
// icon-in-header pattern. Drop it anywhere; the consumer owns the open state via `onOpen`
// (or use the all-in-one PlaylistLauncher which bundles button + drawer + state).

interface PlaylistButtonProps {
  onOpen: () => void;
  // Tooltip + aria-label text. Defaults to a generic "watch videos" phrasing.
  label?: string;
  // Tabler icon size in px.
  size?: number;
}

export default function PlaylistButton({ onOpen, label = 'Watch related videos', size = 20 }: PlaylistButtonProps) {
  return (
    <Tooltip title={label} placement="bottom-end" arrow>
      <IconButton size="small" onClick={onOpen} aria-label={label} sx={{ color: '#FF0000' }}>
        <IconBrandYoutube size={size} />
      </IconButton>
    </Tooltip>
  );
}
