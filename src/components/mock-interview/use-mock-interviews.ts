'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { toast } from 'sonner';
import * as mockInterviewsRepository from '@/db/mock-interviews';
import { generateQuestions } from '@/data/mock-interview-pool';
import type { MockInterviewInput, ReflectionSource } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW - useMockInterviews HOOK ||============================== //

export default function useMockInterviews() {
  const interviews = useLiveQuery(() => mockInterviewsRepository.getAll());
  const loading = interviews === undefined;

  const startInterview = useCallback(async (input: MockInterviewInput) => {
    const questions = generateQuestions(input);
    if (questions.length === 0) {
      toast.error('No questions match your topics/types. Try broadening them.');
      return null;
    }
    try {
      const interview = await mockInterviewsRepository.create(input, questions);
      toast.success('Interview started.');
      return interview;
    } catch {
      toast.error('Could not start the interview.');
      return null;
    }
  }, []);

  // Advances past the live run's current question — optionally saving its speech-captured
  // transcript as the initial reflection — and marks the interview complete on the last one.
  const submitAnswer = useCallback(async (id: string, index: number, transcript: string, isLast: boolean) => {
    try {
      await mockInterviewsRepository.advanceQuestion(id, index, transcript.trim() || null, isLast);
      if (isLast) toast.success('Interview completed. Nice work.');
    } catch {
      toast.error('Could not save your answer.');
    }
  }, []);

  const saveReflection = useCallback(async (id: string, index: number, reflection: string, source: ReflectionSource) => {
    try {
      await mockInterviewsRepository.saveReflection(id, index, reflection, source);
      // Speech capture during the live run saves silently — a toast would interrupt an active interview.
      if (source === 'manual') toast.success('Reflection saved.');
    } catch {
      toast.error('Could not save your reflection.');
    }
  }, []);

  return { interviews: interviews ?? [], loading, startInterview, submitAnswer, saveReflection };
}
