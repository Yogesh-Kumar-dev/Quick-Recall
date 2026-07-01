'use client';

import { useEffect, useRef } from 'react';

// third party
import { useLiveQuery } from 'dexie-react-hooks';

// project imports
import { useNotify } from 'notifications/NotificationProvider';
import * as reviewsRepository from './reviewsRepository';

// ==============================|| REVIEW — "CARDS DUE" REMINDER ||============================== //

// Conveys "you have cards due" ONCE — not in four ways. Mounted app-wide (in the dashboard
// layout), it fires a single reminder at most once per calendar day:
//   • OS notification if the tab is backgrounded (the user has navigated away) and permission
//     is granted; otherwise an in-app snackbar. Never both.
//   • Respects the master + per-category ('review') notification prefs via the manager.
// The always-visible sidebar badge carries the live count the rest of the time, so this hook
// stays a gentle nudge rather than a nag. Clicking the OS notification routes to /review.

const LAST_FIRED_KEY = 'quickrecall.review.lastReminder';

function todayStamp(): string {
  return new Date().toDateString(); // local day, e.g. "Mon Jun 15 2026"
}

// Cross-tab + reload-safe "already reminded today?" check, backed by localStorage so opening a
// second tab or refreshing doesn't re-nag.
function alreadyRemindedToday(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.localStorage.getItem(LAST_FIRED_KEY) === todayStamp();
  } catch {
    return true; // storage blocked → err on the side of NOT nagging
  }
}

function markRemindedToday(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LAST_FIRED_KEY, todayStamp());
  } catch {
    // quota/blocked — no-op
  }
}

export default function useReviewDueReminder() {
  const { notify } = useNotify();
  const dueCount = useLiveQuery(() => reviewsRepository.countDue(Date.now()));

  // Guard so a single mount fires at most one reminder even if the live count updates.
  const firedThisMount = useRef(false);

  useEffect(() => {
    if (dueCount === undefined || dueCount === 0) return; // not loaded yet, or nothing due
    if (firedThisMount.current || alreadyRemindedToday()) return;

    firedThisMount.current = true;
    markRemindedToday();

    // One channel: OS when the user is away (tab hidden), in-app toast when they're here.
    const hidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';

    notify({
      category: 'review',
      title: `${dueCount} card${dueCount === 1 ? '' : 's'} due for review`,
      body: 'Open Review to practice them.',
      channel: hidden ? 'native' : 'snackbar',
      onClick: () => {
        window.focus();
        window.location.assign('/review');
      }
    });
  }, [dueCount, notify]);
}
