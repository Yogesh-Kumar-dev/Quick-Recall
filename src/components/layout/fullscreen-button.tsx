'use client';

import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// Header icon that toggles the whole app into/out of fullscreen (Fullscreen API) — one click
// expands the app for heads-down study sessions. Tracks `fullscreenchange` so the icon/label stay
// correct if the user exits via Esc instead of the button.
export default function FullscreenButton() {
  const [open, setOpen] = useState(false);

  const handleToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      void document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => setOpen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      aria-label={open ? 'Exit fullscreen' : 'Enter fullscreen'}
      title={open ? 'Exit Fullscreen' : 'Fullscreen'}
    >
      {open ? <IconArrowsMinimize size={20} /> : <IconArrowsMaximize size={20} />}
    </Button>
  );
}
