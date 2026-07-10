'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import * as qaRepository from '@/db/speak-up';
import type { SpeakUpQAInput } from '@/types/speak-up';

// ==============================|| SPEAK UP - useSpeakUpQAs HOOK ||============================== //

export default function useSpeakUpQAs() {
  // undefined until the first query resolves — doubles as the loading signal
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
