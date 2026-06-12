// ==============================|| NOTIFICATIONS - TYPES ||============================== //

// The kinds of notification the app can raise. Add new categories here and give
// them an entry in registry.ts — every other part of the system keys off this union.
export type NotificationCategory = 'distraction' | 'timer' | 'review';

// Where a notification is shown:
//  - 'native'   → OS-level Web Notification only (silent if permission not granted)
//  - 'snackbar' → in-app Notistack/Redux snackbar only
//  - 'auto'     → native when permission is granted, otherwise fall back to snackbar
export type NotificationChannel = 'native' | 'snackbar' | 'auto';

// Reserved for future rate-limiting / queueing. Not acted on yet, but carried
// through so callers can start tagging intent without a later breaking change.
export type NotificationPriority = 'low' | 'normal' | 'high';

export interface NotifyRequest {
  category: NotificationCategory;
  title: string;
  body?: string;
  /** Override the category's default channel. */
  channel?: NotificationChannel;
  /** Reserved for future rate-limit/queue logic. Default: 'normal'. */
  priority?: NotificationPriority;
  /** Play the completion chime. Default: the category's `sound` flag. */
  sound?: boolean;
  /** Click handler for native notifications. Default: focus the window. */
  onClick?: () => void;
}

// Returned by `notify` so callers can dismiss a still-visible native notification.
// Snackbar notifications return a no-op handle (they auto-hide).
export interface NotificationHandle {
  dismiss: () => void;
}

// Context the policy layer reads to decide whether a notification should fire.
// Supplied by the React binding, which sources it from Redux + user prefs.
export interface NotificationPolicyContext {
  /** A universal timer is active (running or paused) — distraction nudges are suppressed. */
  timerActive: boolean;
}
