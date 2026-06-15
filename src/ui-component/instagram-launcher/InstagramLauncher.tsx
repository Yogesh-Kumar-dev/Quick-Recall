'use client';

import { useState, type MouseEvent } from 'react';

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import { IconBrandInstagram } from '@tabler/icons-react';

import type { InstagramLink } from 'data/video-playlists';

// Reusable Instagram launcher icon. Instagram can't be embedded, so this just redirects to external
// profile/reel URLs in a new tab. Drop it anywhere (e.g. a MainCard `secondary` slot) and pass an
// array of links. One link → opens directly on click; multiple → a dropdown to pick one. Renders
// nothing when the array is empty, so pages can pass their (possibly empty) list unconditionally.

interface InstagramLauncherProps {
  links: InstagramLink[];
  // Tooltip + aria-label.
  label?: string;
  // Icon size in px.
  size?: number;
}

function openLink(url: string) {
  // noopener/noreferrer: the opened tab can't reach back into this window.
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function InstagramLauncher({ links, label = 'Follow on Instagram', size = 20 }: InstagramLauncherProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (links.length === 0) return null;

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (links.length === 1) {
      openLink(links[0].url);
      return;
    }
    setAnchorEl(e.currentTarget);
  };

  const handleSelect = (url: string) => {
    openLink(url);
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={label} placement="bottom-end" arrow>
        <IconButton size="small" onClick={handleClick} aria-label={label} sx={{ color: '#E4405F' }}>
          <IconBrandInstagram size={size} />
        </IconButton>
      </Tooltip>
      {links.length > 1 && (
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          {links.map((link) => (
            <MenuItem key={link.url} onClick={() => handleSelect(link.url)}>
              {link.label}
            </MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
}
