// project imports
import { DEFAULT_TOPIC_PREFERENCES } from '@/config/topics';
import type { TopicPreferences } from '@/types/topic-preferences';
import { getSetting, setSetting } from './settings';

// ==============================|| DB - TOPIC PREFERENCES ||============================== //

// Device-level topic preferences (key 'topics' in the shared settings table), mirroring the
// push-settings repo pattern. Reads merge over the all-enabled defaults so older records (or a
// topic added later) can never accidentally disable content.

const KEY = 'topics';

export async function get(): Promise<TopicPreferences> {
  const stored = await getSetting<Partial<TopicPreferences>>(KEY, {});
  return { ...DEFAULT_TOPIC_PREFERENCES, ...stored };
}

export async function save(next: TopicPreferences): Promise<TopicPreferences> {
  await setSetting(KEY, next);
  return next;
}
