import { isCategoryEnabled } from './prefs';
import type { NotificationCategory, NotificationPolicyContext } from './types';

// ==============================|| NOTIFICATIONS - POLICY ||============================== //

// Centralized rules for whether a notification is allowed to fire. Cross-feature
// suppression lives here (not scattered in feature code) so future rules — quiet
// hours, "mute during a Pomodoro focus block", rate limits — are additive.

// True when the user has muted this category (master switch off, or category off).
export function isCategoryMuted(category: NotificationCategory): boolean {
  return !isCategoryEnabled(category);
}

// True when a category is suppressed by an active cross-feature rule, even though
// it isn't muted by the user.
export function isSuppressed(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  // Rule #1: while a universal timer is active, don't nag about distraction.
  if (category === 'distraction' && ctx.timerActive) return true;
  return false;
}

// Single gate the manager calls before firing.
export function isBlocked(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  return isCategoryMuted(category) || isSuppressed(category, ctx);
}
