'use client';

import { IconBrandYoutube } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PlaylistDrawer from './playlist-drawer';

// All-in-one, reusable entry point: drop this icon anywhere and pass an array of YouTube playlist
// URLs. It owns its own open/close state and renders the button + the bottom sheet (which mounts
// the adaptive player only while open).

interface PlaylistLauncherProps {
  // Ordered YouTube playlist URLs to play back-to-back.
  playlists: string[];
  // Drawer header title.
  title?: string;
  // Button tooltip + aria-label.
  buttonLabel?: string;
}

export default function PlaylistLauncher({ playlists, title, buttonLabel = 'Watch related videos' }: PlaylistLauncherProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)} aria-label={buttonLabel} title={buttonLabel}>
        <IconBrandYoutube size={20} className="text-[#FF0000]" />
      </Button>
      <PlaylistDrawer open={open} onOpenChange={setOpen} playlists={playlists} title={title} />
    </>
  );
}
