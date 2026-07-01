'use client';
import { useCallback } from 'react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// material-ui
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';

// project imports
import { db } from 'db';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as bookmarksRepository from 'views/bookmarks/bookmarksRepository';
import * as reviewsRepository from 'views/review/reviewsRepository';

// types
import type { BookmarkKind } from 'types/study';

// A self-contained "mark for review" star. Drops onto any content card: it reads its own
// bookmarked state via a SINGLE-ROW live query (so it updates across tabs) and toggles directly
// through the repository. It deliberately doesn't use the list hook — a virtualized page can
// render many of these, and each subscribing to the full bookmark list would be wasteful.
// Bookmarking a flashcard also auto-enrolls it in the SRS deck (the #1↔#2 tie-in).

interface BookmarkButtonProps {
  kind: BookmarkKind;
  refId: string;
  size?: number; // icon px (default 18)
  /** Stop the click from bubbling — needed when the card is itself a link/CardActionArea. */
  stopPropagation?: boolean;
}

export default function BookmarkButton({ kind, refId, size = 18, stopPropagation = false }: BookmarkButtonProps) {
  const dispatch = useDispatch();

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
        dispatch(
          openSnackbar({
            open: true,
            message: nowBookmarked ? 'Saved for review.' : 'Removed from saved.',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } catch {
        dispatch(
          openSnackbar({ open: true, message: 'Could not update bookmark.', variant: 'alert', alert: { color: 'error' }, close: false })
        );
      }
    },
    [dispatch, kind, refId, stopPropagation]
  );

  const isOn = bookmarked === true;

  return (
    <Tooltip title={isOn ? 'Remove from saved' : 'Save for review'}>
      <IconButton
        size="small"
        onClick={handleClick}
        aria-label={isOn ? 'Remove from saved' : 'Save for review'}
        color={isOn ? 'primary' : 'default'}
        sx={{ flexShrink: 0 }}
      >
        {isOn ? <IconBookmarkFilled size={size} /> : <IconBookmark size={size} />}
      </IconButton>
    </Tooltip>
  );
}
