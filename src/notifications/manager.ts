import { toast } from 'sonner';
import { isBlocked } from './policy';
import { NOTIFICATION_CATEGORIES } from './registry';
import type { NotificationCategory, NotificationHandle, NotificationPolicyContext, NotifyRequest } from './types';

// ==============================|| NOTIFICATIONS - MANAGER (core) ||============================== //

// Framework-agnostic; the only place that touches the Web Notification API or decides
// native-vs-toast. notification-provider injects a getter for the live policy context.

const NOOP_HANDLE: NotificationHandle = { dismiss: () => {} };

let getPolicyContext: () => NotificationPolicyContext = () => ({ timerActive: false });

// Track the active native notification per category so dismissCategory can close it.
const activeByCategory = new Map<NotificationCategory, Notification>();

export function configureManager(deps: { getPolicyContext: () => NotificationPolicyContext }): void {
  getPolicyContext = deps.getPolicyContext;
}

function canUseNative(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Safe to call repeatedly — only prompts while permission is still un-decided.
export async function requestPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!canUseNative()) return 'unsupported';
  if (Notification.permission === 'default') {
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }
  return Notification.permission;
}

// A short, asset-free chime via the Web Audio API.
export function playChime(): void {
  if (typeof window === 'undefined') return;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  try {
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(660, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.42);
    osc.onended = () => ctx.close();
  } catch {
    // audio blocked (no user gesture yet) — silent fallback
  }
}

function fireSnackbar(req: NotifyRequest): void {
  toast(req.title, { description: req.body });
}

function fireNative(req: NotifyRequest): NotificationHandle {
  const cfg = NOTIFICATION_CATEGORIES[req.category];
  // Replace any prior native notification of the same category.
  dismissCategory(req.category);

  const n = new Notification(req.title, { body: req.body, icon: cfg.icon, tag: cfg.tag });
  n.onclick = () => {
    if (req.onClick) req.onClick();
    else if (typeof window !== 'undefined') window.focus();
    n.close();
    activeByCategory.delete(req.category);
  };
  n.onclose = () => {
    if (activeByCategory.get(req.category) === n) activeByCategory.delete(req.category);
  };
  activeByCategory.set(req.category, n);

  return { dismiss: () => dismissCategory(req.category) };
}

export function notify(req: NotifyRequest): NotificationHandle {
  if (typeof window === 'undefined') return NOOP_HANDLE;

  // Policy gate: user mute + cross-feature suppression.
  if (isBlocked(req.category, getPolicyContext())) return NOOP_HANDLE;

  const cfg = NOTIFICATION_CATEGORIES[req.category];
  const channel = req.channel ?? cfg.defaultChannel;
  const resolved = channel === 'auto' ? (canUseNative() && Notification.permission === 'granted' ? 'native' : 'snackbar') : channel;

  let handle: NotificationHandle = NOOP_HANDLE;
  if (resolved === 'native') {
    // Explicit 'native' request without permission stays silent rather than falling back.
    if (canUseNative() && Notification.permission === 'granted') handle = fireNative(req);
  } else {
    fireSnackbar(req);
  }

  const playSound = req.sound ?? cfg.sound;
  if (playSound) playChime();

  return handle;
}

// Close the active native notification for a category (e.g. user returned to the tab).
export function dismissCategory(category: NotificationCategory): void {
  const n = activeByCategory.get(category);
  if (n) {
    n.close();
    activeByCategory.delete(category);
  }
}
