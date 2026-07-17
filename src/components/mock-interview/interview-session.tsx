'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconChecks, IconMicrophone, IconPencil, IconPlayerStop } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import * as mockInterviewsRepository from '@/db/mock-interviews';
import { resolveContent, type ResolvedContent } from '@/lib/resolve-content';
import { getSpeechRecognition, type SpeechRecognitionLike } from '@/lib/speech-recognition';
import useMockInterviews from './use-mock-interviews';
import type { MockInterviewQuestion } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW — SESSION RUNNER ||============================== //

// Shared by the live prompt heading and the recap's question title — kept in one place so a new
// content kind (or a resolveContent shape change) only needs updating here.
function resolvedTitle(resolved: ResolvedContent | null): string {
  if (!resolved) return 'Question no longer available';
  if (resolved.kind === 'note') return resolved.note.title;
  if (resolved.kind === 'flashcard') return resolved.card.front;
  return resolved.problem.title;
}

function QuestionPrompt({ question }: { question: MockInterviewQuestion }) {
  const resolved = resolveContent(question.kind, question.refId);
  if (!resolved) {
    return <p className="text-sm text-muted-foreground">This question is no longer available — reflect from memory or skip it.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold">{resolvedTitle(resolved)}</h3>
      {resolved.kind === 'note' && (
        <>
          <p className="mt-2 text-sm text-muted-foreground">{resolved.note.summary}</p>
          {resolved.note.keyPoints.length > 0 && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
              {resolved.note.keyPoints.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          )}
        </>
      )}
      {resolved.kind === 'problem' && (
        <>
          <p className="mt-1 text-xs text-muted-foreground capitalize">{resolved.problem.difficulty}</p>
          {resolved.problem.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {resolved.problem.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Captures the spoken answer via the Web Speech API (mic toggle + live transcript) so there's
// something concrete to review later — no manual typing during the live run. Degrades to a
// plain "speak out loud" hint on browsers without SpeechRecognition (e.g. Firefox).
function AnswerRecorder({ onTranscriptChange }: { onTranscriptChange: (transcript: string) => void }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interim, setInterim] = useState('');
  const [supported, setSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    const SpeechRecognitionCtor = getSpeechRecognition();
    if (!SpeechRecognitionCtor) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalChunk = '';
      let interimChunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalChunk += text;
        else interimChunk += text;
      }
      if (finalChunk) {
        setTranscript((prev) => {
          const next = prev ? `${prev} ${finalChunk.trim()}` : finalChunk.trim();
          onTranscriptChange(next);
          return next;
        });
      }
      setInterim(interimChunk);
    };

    recognition.onend = () => {
      setListening(false);
      setInterim('');
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMsg('Microphone access was blocked.');
      } else if (event.error === 'no-speech') {
        setErrorMsg("Didn't catch that — try again.");
      } else if (event.error === 'network') {
        setErrorMsg('Speech recognition needs a network connection.');
      } else {
        setErrorMsg('Something went wrong with speech recognition.');
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try {
        recognition.stop();
      } catch {
        // ignore — recognition may not be running
      }
    };
  }, [onTranscriptChange]);

  if (!supported) {
    return (
      <p className="mt-4 text-sm text-muted-foreground italic">
        Speech recognition isn&apos;t supported in this browser — just speak your answer out loud, then move on.
      </p>
    );
  }

  const toggle = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    setErrorMsg('');
    try {
      recognition.start();
      setListening(true);
    } catch {
      // start() throws if already started — ignore
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <Button type="button" variant={listening ? 'destructive' : 'outline'} size="sm" className="gap-1.5" onClick={toggle}>
          {listening ? <IconPlayerStop className="size-4" /> : <IconMicrophone className="size-4" />}
          {listening ? 'Stop' : 'Record answer'}
        </Button>
        {errorMsg && <span className="text-xs text-destructive">{errorMsg}</span>}
      </div>
      {(transcript || interim) && (
        <div className="mt-2 rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
          {transcript}
          {interim && (
            <span className="text-muted-foreground">
              {transcript ? ' ' : ''}
              {interim}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function RunningSession({
  interviewId,
  questions,
  currentIndex
}: {
  interviewId: string;
  questions: MockInterviewQuestion[];
  currentIndex: number;
}) {
  const { submitAnswer } = useMockInterviews();
  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;

  const [transcript, setTranscript] = useState('');

  const goNext = () => submitAnswer(interviewId, currentIndex, transcript, isLast);

  const progress = (currentIndex / questions.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Progress value={progress} className="mb-2" />
      <p className="text-xs text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <div className="mt-4 rounded-xl border border-border bg-card p-6">
        <QuestionPrompt question={question} />
      </div>

      <AnswerRecorder onTranscriptChange={setTranscript} />

      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={goNext}>
          {isLast ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}

// One question's post-interview self-reflection — resolved content (with the answer/reference
// link always visible, unlike the live run) plus an editable reflection saved on demand.
function RecapQuestion({ interviewId, index, question }: { interviewId: string; index: number; question: MockInterviewQuestion }) {
  const { saveReflection } = useMockInterviews();
  const [reflection, setReflection] = useState(question.reflection);

  const resolved = resolveContent(question.kind, question.refId);
  const title = resolvedTitle(resolved);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-sm font-semibold">
        {index + 1}. {title}
      </p>
      {resolved?.kind === 'flashcard' && <p className="mt-1 text-sm text-muted-foreground">{resolved.card.back}</p>}
      {resolved?.kind === 'problem' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          View problem &amp; reference solution →
        </Link>
      )}

      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={`reflection-${index}`} className="text-xs font-medium text-muted-foreground">
            Your reflection
          </label>
          {question.reflectionSource === 'speech' && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <IconMicrophone size={12} /> Auto-captured — check for mis-hearing
            </span>
          )}
          {question.reflectionSource === 'manual' && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <IconPencil size={12} /> Edited
            </span>
          )}
        </div>
        <Textarea
          id={`reflection-${index}`}
          rows={3}
          placeholder="How would you have answered this? What would you improve?"
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
        />
      </div>
      <Button
        size="sm"
        variant="outline"
        className="mt-2"
        disabled={reflection === question.reflection}
        onClick={() => saveReflection(interviewId, index, reflection, 'manual')}
      >
        Save reflection
      </Button>
    </div>
  );
}

function CompletedRecap({
  interviewId,
  questions,
  personaLabel
}: {
  interviewId: string;
  questions: MockInterviewQuestion[];
  personaLabel: string;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 rounded-xl border border-border bg-card p-6 text-center">
        <IconChecks size={40} className="mx-auto text-primary opacity-70" />
        <h2 className="mt-3 text-xl font-bold">Interview complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">with {personaLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Review each question below — your captured answer (if recorded) is prefilled, edit it or add your own notes.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => (
          <RecapQuestion key={`${q.kind}:${q.refId}`} interviewId={interviewId} index={i} question={q} />
        ))}
      </div>
    </div>
  );
}

export default function InterviewSession({ interviewId }: { interviewId: string }) {
  const interview = useLiveQuery(() => mockInterviewsRepository.get(interviewId), [interviewId]);

  if (interview === undefined) return null;
  if (!interview) {
    return <p className="mx-auto w-full max-w-2xl text-sm text-muted-foreground">Interview not found.</p>;
  }

  const personaLabel = interview.persona.name ? `${interview.persona.name} (${interview.persona.title})` : interview.persona.title;

  if (interview.status === 'completed' || interview.currentIndex >= interview.questions.length) {
    return <CompletedRecap interviewId={interview.id} questions={interview.questions} personaLabel={personaLabel} />;
  }

  return (
    <div>
      <p className="mx-auto mb-4 w-full max-w-2xl text-sm text-muted-foreground">Interviewing with {personaLabel}</p>
      <RunningSession
        key={interview.currentIndex}
        interviewId={interview.id}
        questions={interview.questions}
        currentIndex={interview.currentIndex}
      />
    </div>
  );
}
