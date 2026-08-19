'use client';

import { Share2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Shares a deep link via the Web Share API when available, falling back to copying the
// URL to the clipboard. If `path` is given it is shared verbatim (relative → resolved
// against the current origin); otherwise a note-style deep link (?open=<id>) is built on
// the current page.

interface ShareButtonProps {
  title: string;
  text: string;
  // absolute/relative path to share; when omitted the current path + ?open=<id> is shared
  path?: string;
  // legacy note deep-link target, used only when `path` is not provided
  id?: string;
  // needed when the card is itself clickable (e.g. LeafyGreen ExpandableCard, index Link)
  // so sharing doesn't also navigate/expand it
  stopPropagation?: boolean;
}

export default function ShareButton({ title, text, path, id, stopPropagation = false }: ShareButtonProps) {
  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      if (stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      const url = path
        ? new URL(path, window.location.origin).toString()
        : `${window.location.origin}${window.location.pathname}?open=${encodeURIComponent(id ?? '')}`;
      const shareData = { title, text, url };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          return;
        }
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard.');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        toast.error('Could not share this link.');
      }
    },
    [id, path, text, title, stopPropagation]
  );

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} aria-label="Share" title="Share" className="h-8 w-8 shrink-0 p-0">
      <Share2 className="size-5" />
    </Button>
  );
}
