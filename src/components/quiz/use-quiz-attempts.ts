'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import * as quizRepository from '@/db/quiz';
import type { QuizAttempt } from '@/types/study';

// ==============================|| QUIZ - useQuizAttempts HOOK ||============================== //

export default function useQuizAttempts() {
  const attempts = useLiveQuery(() => quizRepository.getAll());

  const recordAttempt = useCallback(async (input: Omit<QuizAttempt, 'id' | 'completedAt'>) => {
    try {
      await quizRepository.create(input);
    } catch {
      toast.error('Could not save quiz result.');
    }
  }, []);

  return { attempts: attempts ?? [], recordAttempt };
}
