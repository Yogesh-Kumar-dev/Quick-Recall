'use client';

import { useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { db } from '@/db';
import * as bookmarksRepository from '@/db/bookmarks';
import * as reviewsRepository from '@/db/reviews';
import type { BookmarkKind } from '@/types/study';

// A self-contained "mark for review" star. Drops onto any content card: it reads its own
// bookmarked state via a SINGLE-ROW live query (so it updates across tabs) and toggles directly
// through the repository. It deliberately doesn't read the full bookmark list — a long page can
// render many of these, and each subscribing to the whole list would be wasteful.
// Bookmarking a flashcard also auto-enrolls it in the SRS deck (the bookmarks ↔ review tie-in).

interface BookmarkButtonProps {
  kind: BookmarkKind;
  refId: string;
  // Stop the click from bubbling — needed when the card header is itself clickable
  // (e.g. LeafyGreen ExpandableCard), so toggling a bookmark doesn't also expand it.
  stopPropagation?: boolean;
}

export default function BookmarkButton({ kind, refId, stopPropagation = false }: BookmarkButtonProps) {
  // Single-row live query keyed on this item's composite id.
  const bookmarked = useLiveQuery(() => db.bookmarks.get(`${kind}:${refId}`).then((b) => b !== undefined), [kind, refId]);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      if (stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      try {
        const nowBookmarked = await bookmarksRepository.toggle(kind, refId);
        if (nowBookmarked && kind === 'flashcard') {
          await reviewsRepository.enroll(refId);
        }
        toast.success(nowBookmarked ? 'Saved for review.' : 'Removed from saved.');
      } catch {
        toast.error('Could not update bookmark.');
      }
    },
    [kind, refId, stopPropagation]
  );

  const isOn = bookmarked === true;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      aria-pressed={isOn}
      aria-label={isOn ? 'Remove from saved' : 'Save for review'}
      title={isOn ? 'Remove from saved' : 'Save for review'}
      className="h-8 w-8 shrink-0 p-0"
    >
      <Bookmark className={`size-5 ${isOn ? 'fill-current text-primary' : ''}`} />
    </Button>
  );
}
