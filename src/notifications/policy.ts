import { isCategoryEnabled } from './prefs';
import type { NotificationCategory, NotificationPolicyContext } from './types';

// ==============================|| NOTIFICATIONS - POLICY ||============================== //

// Centralized rules for whether a notification is allowed to fire, so future rules (quiet
// hours, focus-block mute, rate limits) are additive rather than scattered in feature code.

export function isCategoryMuted(category: NotificationCategory): boolean {
  return !isCategoryEnabled(category);
}

export function isSuppressed(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  // While a universal timer is active, don't nag about distraction.
  if (category === 'distraction' && ctx.timerActive) return true;
  return false;
}

export function isBlocked(category: NotificationCategory, ctx: NotificationPolicyContext): boolean {
  return isCategoryMuted(category) || isSuppressed(category, ctx);
}
