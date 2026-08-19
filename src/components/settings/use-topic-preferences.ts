'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import * as topicPreferencesRepository from '@/db/topic-preferences';

// ==============================|| SETTINGS - useTopicPreferences HOOK ||============================== //

// Live-reads the topic preferences table; every consumer (sidebar, route gate, indexes, mock
// interview) reacts instantly when the user saves a change in Settings.

export default function useTopicPreferences() {
  const prefs = useLiveQuery(() => topicPreferencesRepository.get());
  const loading = prefs === undefined;

  return { prefs, loading, save: topicPreferencesRepository.save };
}
