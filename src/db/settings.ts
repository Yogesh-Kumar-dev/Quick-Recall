// project imports
import { db } from './index';

// ==============================|| DB - GENERIC KEY/VALUE SETTINGS ||============================== //

// Single shared table for all device-level settings (push, and whatever comes next) — one row
// per key, instead of a dedicated Dexie table per setting. Feature-specific repos (e.g.
// src/db/push-settings.ts) wrap this with a typed key and shape.

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return row ? (row.value as T) : fallback;
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  await db.settings.put({ key, value });
}
