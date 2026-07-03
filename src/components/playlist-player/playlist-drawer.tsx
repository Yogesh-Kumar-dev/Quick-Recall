'use client';

import { IconBrandYoutube } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import PlaylistPlayer from './playlist-player';

// Bottom sheet that hosts the playlist player. The player is mounted ONLY while the sheet is open,
// so closing it tears down the iframe and stops playback (no background audio).

interface PlaylistDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlists: string[];
  title?: string;
}

export default function PlaylistDrawer({ open, onOpenChange, playlists, title = 'Related Videos' }: PlaylistDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[100dvh] flex-col gap-0 rounded-none p-0 data-[side=bottom]:h-[100dvh]">
        <SheetHeader className="flex-row items-center justify-between border-b border-border py-3">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <IconBrandYoutube size={22} className="text-[#FF0000]" />
            {title}
          </SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
          {open && <PlaylistPlayer playlists={playlists} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
