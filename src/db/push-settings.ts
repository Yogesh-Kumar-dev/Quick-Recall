// project imports

// types
import type { PushSettings } from '@/types/push-settings';
import { getSetting, setSetting } from './settings';

// ==============================|| DB - PUSH SETTINGS ||============================== //

const KEY = 'push';
const DEFAULT_SETTINGS: PushSettings = { deviceId: '', enabled: false, updatedAt: 0 };

export async function get(): Promise<PushSettings> {
  return getSetting(KEY, DEFAULT_SETTINGS);
}

export async function save(patch: Partial<PushSettings>): Promise<PushSettings> {
  const existing = await get();
  const next: PushSettings = { ...existing, ...patch, updatedAt: Date.now() };
  await setSetting(KEY, next);
  return next;
}
