'use client';

import { IconBrandYoutube } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// PlaylistDrawer hosts react-youtube + axios (via PlaylistPlayer) - lazy-load on first open.
const PlaylistDrawer = dynamic(() => import('./playlist-drawer'), { ssr: false });

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
      {open && <PlaylistDrawer open={open} onOpenChange={setOpen} playlists={playlists} title={title} />}
    </>
  );
}
