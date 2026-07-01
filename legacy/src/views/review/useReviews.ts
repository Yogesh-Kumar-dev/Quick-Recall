import { useCallback } from 'react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import * as reviewsRepository from './reviewsRepository';
import { review as schedule } from './scheduler';

// types
import type { ReviewQuality } from 'types/study';

// Bridges the review session UI ↔ scheduler + repository. The due list and counts are LIVE
// queries so the landing count and session deck stay in sync as cards are rated or enrolled
// (including from other tabs). `rate` runs the pure SM-2 scheduler and persists the result.
//
// Note: the due set is read once at mount and re-derived live. A rated card's `dueAt` moves
// into the future, so it naturally drops out of `due` — the session view walks its own frozen
// snapshot of the deck (see the view) to avoid the list shifting mid-session.

export default function useReviews() {
  const dispatch = useDispatch();

  // Snapshot "now" per query run. Cards due at-or-before now.
  const due = useLiveQuery(() => reviewsRepository.getDue(Date.now()));
  const enrolledCount = useLiveQuery(() => reviewsRepository.count());

  const loading = due === undefined;

  // Persists the rating and returns the resulting state (so the caller can confirm when the card
  // will resurface). Returns null if the card vanished or the write failed.
  const rate = useCallback(
    async (refId: string, quality: ReviewQuality) => {
      try {
        const state = await reviewsRepository.get(refId);
        if (!state) return null;
        const next = schedule(state, quality, Date.now());
        await reviewsRepository.upsertAfterReview(next);
        return next;
      } catch {
        dispatch(
          openSnackbar({ open: true, message: 'Could not save your rating.', variant: 'alert', alert: { color: 'error' }, close: false })
        );
        return null;
      }
    },
    [dispatch]
  );

  const unenroll = useCallback(
    async (refId: string) => {
      try {
        await reviewsRepository.remove(refId);
        dispatch(
          openSnackbar({ open: true, message: 'Removed from review.', variant: 'alert', alert: { color: 'success' }, close: false })
        );
      } catch {
        dispatch(
          openSnackbar({ open: true, message: 'Could not remove card.', variant: 'alert', alert: { color: 'error' }, close: false })
        );
      }
    },
    [dispatch]
  );

  return {
    due: due ?? [],
    dueCount: due?.length ?? 0,
    enrolledCount: enrolledCount ?? 0,
    loading,
    rate,
    unenroll
  };
}
