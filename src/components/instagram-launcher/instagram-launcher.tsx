'use client';

import { IconBrandInstagram } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { InstagramLink } from '@/data/video-playlists';

// Reusable Instagram launcher icon. Instagram can't be embedded, so this just redirects to external
// profile/reel URLs in a new tab. Drop it anywhere and pass an array of links. One link → opens
// directly on click; multiple → a dropdown to pick one. Renders nothing when the array is empty, so
// pages can pass their (possibly empty) list unconditionally.

interface InstagramLauncherProps {
  links: InstagramLink[];
  // Tooltip + aria-label.
  label?: string;
}

function openLink(url: string) {
  // noopener/noreferrer: the opened tab can't reach back into this window.
  window.open(url, '_blank', 'noopener,noreferrer');
}

export default function InstagramLauncher({ links, label = 'Follow on Instagram' }: InstagramLauncherProps) {
  if (links.length === 0) return null;

  if (links.length === 1) {
    return (
      <Button variant="ghost" size="icon-sm" onClick={() => openLink(links[0].url)} aria-label={label} title={label}>
        <IconBrandInstagram size={20} className="text-[#E4405F]" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={label} title={label} />}>
        <IconBrandInstagram size={20} className="text-[#E4405F]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {links.map((link) => (
          <DropdownMenuItem key={link.url} onClick={() => openLink(link.url)}>
            {link.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
