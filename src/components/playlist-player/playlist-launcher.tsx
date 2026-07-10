'use client';

import { IconBrandYoutube } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PlaylistDrawer from './playlist-drawer';

interface PlaylistLauncherProps {
  playlists: string[];
  title?: string;
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
