'use client';

import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { predefinedQuestions } from '@/data/speak-up-questions';
import AiVoiceTools from './ai-voice-tools';
import QAPracticeBank from './qa-practice-bank';
import SpeechPractice from './speech-practice';

// ==============================|| SPEAK UP - VIEW ||============================== //

// Client-only feature (Web Speech API + Dexie/IndexedDB per device). The current-question
// index is the single source of truth shared between the rehearsal tool (advances it via
// "Next question") and the question bank (click a row to select / highlight it).

export default function SpeakUpView() {
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleNextQuestion = () => setQuestionIndex((prev) => (prev + 1) % predefinedQuestions.length);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Speak Up</h1>
        <p className="mt-1 text-muted-foreground">
          Practice speaking your answers out loud, then build a personal bank of questions and prepared answers to rehearse.
        </p>
      </div>

      {/* Rehearsal tool (player) on the left, question bank ("up next") on the right.
          Below md the bank stacks underneath. */}
      <div className="grid items-start gap-6 md:grid-cols-[minmax(0,1fr)_minmax(300px,360px)] md:items-stretch">
        <div className="min-w-0">
          <SpeechPractice questionIndex={questionIndex} onNextQuestion={handleNextQuestion} />
        </div>
        <div className="min-w-0">
          <QAPracticeBank activeIndex={questionIndex} onSelectQuestion={setQuestionIndex} />
        </div>
      </div>

      <Separator className="my-8" />

      {/* Related — AI voice partners (full width, below the player) */}
      <AiVoiceTools />
    </div>
  );
}
