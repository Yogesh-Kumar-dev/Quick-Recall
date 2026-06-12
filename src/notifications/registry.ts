// types
import type { NotificationCategory, NotificationChannel } from './types';

// ==============================|| NOTIFICATIONS - CATEGORY REGISTRY ||============================== //

// Per-category configuration — the single extension point when adding a new
// notification type. `tag` is the OS-level dedupe key: a new notification of a
// category replaces the previous one of THAT category, but never another
// category's (timer and distraction never clobber each other).

export interface CategoryConfig {
  tag: string;
  icon: string;
  defaultChannel: NotificationChannel;
  sound: boolean;
}

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, CategoryConfig> = {
  // Native-only, silent if permission not granted — preserves the original
  // distraction-alert behavior.
  distraction: { tag: 'distraction-alert', icon: '/favicon.ico', defaultChannel: 'native', sound: false },
  // Native when granted, snackbar fallback otherwise; plays a chime on fire.
  timer: { tag: 'universal-timer', icon: '/favicon.ico', defaultChannel: 'auto', sound: true },
  // "Cards due for review" reminder. Auto: native when the tab is backgrounded + permission
  // granted, in-app snackbar otherwise — never both. Silent (it's a gentle nudge, not an alarm).
  review: { tag: 'review-due', icon: '/favicon.ico', defaultChannel: 'auto', sound: false }
};
