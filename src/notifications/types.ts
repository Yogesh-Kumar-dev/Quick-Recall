// ==============================|| NOTIFICATIONS - TYPES ||============================== //

// Add new categories here and give them an entry in registry.ts.
export type NotificationCategory = 'distraction' | 'timer' | 'review';

// 'native' → OS notification only (silent without permission); 'snackbar' → in-app toast only;
// 'auto' → native if permission granted, else toast.
export type NotificationChannel = 'native' | 'snackbar' | 'auto';

// Reserved for future rate-limiting/queueing; not acted on yet.
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

// Toast notifications return a no-op handle (they auto-hide).
export interface NotificationHandle {
  dismiss: () => void;
}

export interface NotificationPolicyContext {
  /** A universal timer is active (running or paused) — distraction nudges are suppressed. */
  timerActive: boolean;
}
