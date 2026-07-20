'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconChecks, IconMicrophone, IconPencil } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import * as mockInterviewsRepository from '@/db/mock-interviews';
import { resolveContent, type ResolvedContent } from '@/lib/resolve-content';
import useMockInterviews from './use-mock-interviews';
import { ChatBubble } from './chat/chat-bubble';
import { ChatInput } from './chat/chat-input';
import type { MockInterviewQuestion } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW — SESSION CHAT ||============================== //

// Renders the whole interview (questions asked so far, the live question, and — once complete —
// the recap) as one chat transcript derived from `interview.questions`/`currentIndex`/`status`.
// Nothing chat-specific is persisted: reloading mid-interview just re-derives the same messages.

function resolvedTitle(resolved: ResolvedContent | null): string {
  if (!resolved) return 'Question no longer available';
  if (resolved.kind === 'note') return resolved.note.title;
  if (resolved.kind === 'flashcard') return resolved.card.front;
  return resolved.problem.title;
}

function QuestionBubbleContent({ question }: { question: MockInterviewQuestion }) {
  const resolved = resolveContent(question.kind, question.refId);
  if (!resolved) {
    return <p>This question is no longer available — reflect from memory or skip it.</p>;
  }

  return (
    <div>
      <p className="font-semibold">{resolvedTitle(resolved)}</p>
      {resolved.kind === 'note' && (
        <>
          <p className="mt-1 text-muted-foreground">{resolved.note.summary}</p>
          {resolved.note.keyPoints.length > 0 && (
            <ul className="mt-2 list-disc space-y-0.5 pl-4 text-muted-foreground">
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
            <div className="mt-1.5 flex flex-wrap gap-1">
              {resolved.problem.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
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

// Post-interview recap bubble: reference answer always visible (unlike the live run) plus an
// inline expand-to-edit reflection, saved on demand via the existing repository call.
function RecapBubble({ interviewId, index, question }: { interviewId: string; index: number; question: MockInterviewQuestion }) {
  const { saveReflection } = useMockInterviews();
  const [editing, setEditing] = useState(false);
  const [reflection, setReflection] = useState(question.reflection);

  const resolved = resolveContent(question.kind, question.refId);
  const title = resolvedTitle(resolved);

  const save = () => {
    saveReflection(interviewId, index, reflection, 'manual');
    setEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm">
      <p className="font-semibold">
        {index + 1}. {title}
      </p>
      {resolved?.kind === 'flashcard' && <p className="mt-1 text-muted-foreground">{resolved.card.back}</p>}
      {resolved?.kind === 'problem' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          View problem &amp; reference solution →
        </Link>
      )}

      <div className="mt-3 flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Your reflection</span>
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
        {editing ? (
          <>
            <Textarea rows={3} value={reflection} onChange={(e) => setReflection(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" disabled={reflection === question.reflection} onClick={save}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setReflection(question.reflection);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-start justify-between gap-2">
            <p className="whitespace-pre-wrap">
              {reflection || <span className="text-muted-foreground italic">No reflection recorded.</span>}
            </p>
            <Button size="icon-sm" variant="ghost" onClick={() => setEditing(true)}>
              <IconPencil className="size-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SessionChat({ interviewId }: { interviewId: string }) {
  const interview = useLiveQuery(() => mockInterviewsRepository.get(interviewId), [interviewId]);
  const { submitAnswer } = useMockInterviews();
  const [answerValue, setAnswerValue] = useState('');

  if (interview === undefined) return null;
  if (!interview) {
    return <p className="mx-auto w-full max-w-2xl text-sm text-muted-foreground">Interview not found.</p>;
  }

  const personaLabel = interview.persona.name ? `${interview.persona.name} (${interview.persona.title})` : interview.persona.title;
  const isComplete = interview.status === 'completed';
  const currentIndex = interview.currentIndex;

  const goNext = (transcript: string) => {
    const isLast = currentIndex === interview.questions.length - 1;
    submitAnswer(interviewId, currentIndex, transcript, isLast);
    setAnswerValue('');
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <p className="text-sm text-muted-foreground">Interviewing with {personaLabel}</p>

      {interview.questions.slice(0, currentIndex).map((q) => (
        <div key={`${q.kind}:${q.refId}`} className="flex flex-col gap-2">
          <ChatBubble from="bot">
            <QuestionBubbleContent question={q} />
          </ChatBubble>
          <ChatBubble from="user">{q.reflection || '(no answer recorded)'}</ChatBubble>
        </div>
      ))}

      {!isComplete && currentIndex < interview.questions.length && (
        <div className="flex flex-col gap-2">
          <Progress value={(currentIndex / interview.questions.length) * 100} />
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {interview.questions.length}
          </p>
          <ChatBubble from="bot">
            <QuestionBubbleContent question={interview.questions[currentIndex]} />
          </ChatBubble>
          <ChatInput
            key={currentIndex}
            value={answerValue}
            onChange={setAnswerValue}
            onSubmit={goNext}
            mic
            allowEmpty
            placeholder="Type or speak your answer…"
          />
        </div>
      )}

      {isComplete && (
        <>
          <ChatBubble from="bot">
            <span className="flex items-center gap-2">
              <IconChecks className="size-4 text-primary" />
              Interview complete — nice work! Review each answer below and edit your reflection if you&apos;d like.
            </span>
          </ChatBubble>
          <div className="flex flex-col gap-3">
            {interview.questions.map((q, i) => (
              <RecapBubble key={`${q.kind}:${q.refId}`} interviewId={interview.id} index={i} question={q} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
