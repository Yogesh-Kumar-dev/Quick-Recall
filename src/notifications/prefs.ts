// types
import type { NotificationCategory } from './types';

// ==============================|| NOTIFICATIONS - USER PREFERENCES ||============================== //

// Persisted, cross-tab notification preferences. Backed by localStorage directly
// (rather than the useLocalStorage hook) so the framework-agnostic manager can
// read prefs synchronously when deciding whether to fire. React consumers use
// `useNotificationPrefs` (in NotificationProvider) which subscribes to changes.

const STORAGE_KEY = 'quickrecall.notifications';

export interface NotificationPrefs {
  /** Master switch — when off, nothing fires. */
  enabled: boolean;
  /** Per-category enable flags, for a future preferences panel. */
  categories: Record<NotificationCategory, boolean>;
}

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: true,
  categories: { distraction: true, timer: true }
};

function read(): NotificationPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    // Merge over defaults so a newly-added category is enabled by default and a
    // malformed/partial blob can't crash reads.
    return {
      enabled: typeof parsed.enabled === 'boolean' ? parsed.enabled : DEFAULT_PREFS.enabled,
      categories: { ...DEFAULT_PREFS.categories, ...(parsed.categories ?? {}) }
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

type Listener = (prefs: NotificationPrefs) => void;
const listeners = new Set<Listener>();

// Cross-tab: pick up writes made in other tabs via the storage event.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.storageArea === window.localStorage && e.key === STORAGE_KEY) {
      const next = read();
      listeners.forEach((l) => l(next));
    }
  });
}

export function getPrefs(): NotificationPrefs {
  return read();
}

export function setPrefs(next: NotificationPrefs): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / serialization failure — no-op
  }
  // The storage event does NOT fire in the tab that wrote it, so notify locally.
  listeners.forEach((l) => l(next));
}

export function subscribePrefs(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Convenience used by the manager's mute check.
export function isCategoryEnabled(category: NotificationCategory): boolean {
  const prefs = read();
  return prefs.enabled && prefs.categories[category] !== false;
}
