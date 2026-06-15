'use client';

import { useState } from 'react';

import PlaylistButton from './PlaylistButton';
import PlaylistDrawer from './PlaylistDrawer';

// All-in-one, reusable entry point: drop this icon anywhere and pass an array of YouTube playlist
// URLs. It owns its own open/close state and renders the button + the bottom drawer (which mounts
// the adaptive player only while open). For finer control you can compose PlaylistButton +
// PlaylistDrawer yourself instead.

interface PlaylistLauncherProps {
  // Ordered YouTube playlist URLs to play back-to-back.
  playlists: string[];
  // Drawer header title.
  title?: string;
  // Button tooltip + aria-label.
  buttonLabel?: string;
  // Icon size in px.
  iconSize?: number;
}

export default function PlaylistLauncher({ playlists, title, buttonLabel, iconSize }: PlaylistLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <PlaylistButton onOpen={() => setOpen(true)} label={buttonLabel} size={iconSize} />
      <PlaylistDrawer open={open} onClose={() => setOpen(false)} playlists={playlists} title={title} />
    </>
  );
}
