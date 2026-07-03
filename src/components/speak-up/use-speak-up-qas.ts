'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import * as qaRepository from '@/db/speak-up';
import type { SpeakUpQAInput } from '@/types/speak-up';

// ==============================|| SPEAK UP - useSpeakUpQAs HOOK ||============================== //

// Bridges UI ↔ repository. The list is a LIVE query: Dexie re-runs it and the component
// re-renders automatically whenever the speakUpQAs table changes — including edits made in
// another browser tab. So there's no local state to keep in sync and no optimistic
// patching; mutations just write, and the live query reflects them. Components never call
// the repository directly — they go through here.

export default function useSpeakUpQAs() {
  // `undefined` until the first query resolves → that's our loading signal.
  const qas = useLiveQuery(() => qaRepository.getAll());
  const loading = qas === undefined;

  const addQA = useCallback(async (input: SpeakUpQAInput) => {
    try {
      await qaRepository.create(input);
      toast.success('Answer saved.');
    } catch {
      toast.error('Could not save answer.');
    }
  }, []);

  const editQA = useCallback(async (id: string, input: SpeakUpQAInput) => {
    try {
      await qaRepository.update(id, input);
      toast.success('Answer updated.');
    } catch {
      toast.error('Could not update answer.');
    }
  }, []);

  const deleteQA = useCallback(async (id: string) => {
    try {
      await qaRepository.remove(id);
      toast.success('Answer deleted.');
    } catch {
      toast.error('Could not delete answer.');
    }
  }, []);

  return { qas: qas ?? [], loading, addQA, editQA, deleteQA };
}
