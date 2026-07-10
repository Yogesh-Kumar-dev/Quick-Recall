import type { NotificationCategory, NotificationChannel } from './types';

// ==============================|| NOTIFICATIONS - CATEGORY REGISTRY ||============================== //

// Per-category config; add new notification types here. `tag` is the OS-level dedupe key so
// categories never clobber each other's notifications.

export interface CategoryConfig {
  tag: string;
  icon: string;
  defaultChannel: NotificationChannel;
  sound: boolean;
}

export const NOTIFICATION_CATEGORIES: Record<NotificationCategory, CategoryConfig> = {
  // Native-only, silent if permission not granted — preserves the original distraction-alert behavior.
  distraction: { tag: 'distraction-alert', icon: '/favicon.ico', defaultChannel: 'native', sound: false },
  timer: { tag: 'universal-timer', icon: '/favicon.ico', defaultChannel: 'auto', sound: true },
  review: { tag: 'review-due', icon: '/favicon.ico', defaultChannel: 'auto', sound: false }
};
