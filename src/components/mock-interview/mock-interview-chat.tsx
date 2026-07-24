'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconArrowLeft, IconChecks, IconMicrophone, IconPencil } from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { MessageGroup } from '@/components/ui/message';
import CodeBlock from '@/components/content/code-block';
import { quizOptionClasses } from '@/components/quiz/quiz-option-classes';
import useJobs from '@/components/job-tracker/use-jobs';
import { resolveContent, type ResolvedContent } from '@/lib/resolve-content';
import * as mockInterviewsRepository from '@/db/mock-interviews';
import { MOCK_INTERVIEW_TOPICS } from '@/data/mock-interview-pool';
import { ChatBubble } from './chat/chat-bubble';
import { ChatInput } from './chat/chat-input';
import { AnimatedChips } from './chat/animated-chips';
import { TypingIndicator } from './chat/typing-indicator';
import useMockInterviews from './use-mock-interviews';
import type { MockInterviewPersona, MockInterviewQuestion, MockInterviewQuestionKind } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW — UNIFIED CHAT ||============================== //

// Single continuous chat that handles both setup and interview phases.
// Everything happens in one chat window — no redirects between phases.

const KIND_OPTIONS: { value: MockInterviewQuestionKind; label: string }[] = [
  { value: 'note', label: 'Notes' },
  { value: 'flashcard', label: 'Flashcards' },
  { value: 'problem', label: 'Machine Coding' },
  { value: 'quiz', label: 'Quiz (MCQ)' }
];

const COUNT_PRESETS = ['5', '10', '15', '20'];

type SetupStep = 'topics' | 'kinds' | 'count' | 'personaMode' | 'personaJob' | 'personaName' | 'personaTitle';

const SETUP_QUESTIONS: Record<SetupStep, string> = {
  topics: 'Which topics do you want to be quizzed on?',
  kinds: 'What kinds of questions should I include?',
  count: 'How many questions should we go through?',
  personaMode: "Who's interviewing you today?",
  personaJob: 'Which job is this for?',
  personaName: "What's your interviewer's name? (optional)",
  personaTitle: 'And their title? (optional)'
};

const INTERVIEW_TYPING_DELAY_MS = 800;

// Helper functions
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function resolvedTitle(resolved: ResolvedContent | null): string {
  if (!resolved) return 'Question no longer available';
  if (resolved.kind === 'note') return resolved.note.title;
  if (resolved.kind === 'flashcard') return resolved.card.front;
  if (resolved.kind === 'quiz') return resolved.question.question;
  return resolved.problem.title;
}

// Question content renderer. revealAnswer gates the note's summary/keyPoints (and, for a quiz
// question, the graded options) — withheld while the question is still live so answering it is
// an actual recall test, not a copy exercise.
function QuestionBubbleContent({ question, revealAnswer = false }: { question: MockInterviewQuestion; revealAnswer?: boolean }) {
  const resolved = resolveContent(question.kind, question.refId);
  if (!resolved) {
    return <p>This question is no longer available — reflect from memory or skip it.</p>;
  }

  return (
    <div>
      <p className="font-semibold">{resolvedTitle(resolved)}</p>
      {resolved.kind === 'note' && revealAnswer && (
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
      {resolved.kind === 'quiz' && resolved.question.code && (
        <div className="mt-2">
          <CodeBlock code={resolved.question.code} />
        </div>
      )}
      {resolved.kind === 'quiz' && revealAnswer && (
        <div className="mt-2 space-y-1 text-xs">
          {resolved.question.options.map((opt, i) => (
            <p
              key={opt}
              className={`rounded border px-2 py-1 ${quizOptionClasses({ isSelected: question.selectedOptionIndex === i, isCorrect: i === resolved.question.correctIndex, revealed: true })}`}
            >
              {opt}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// Recap bubble for completed interview
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
      {resolved?.kind === 'quiz' && resolved.question.code && (
        <div className="mt-2">
          <CodeBlock code={resolved.question.code} />
        </div>
      )}
      {resolved?.kind === 'quiz' && (
        <div className="mt-2 space-y-1">
          {resolved.question.options.map((opt, i) => (
            <p
              key={opt}
              className={`rounded border px-2 py-1 text-xs ${quizOptionClasses({ isSelected: question.selectedOptionIndex === i, isCorrect: i === resolved.question.correctIndex, revealed: true })}`}
            >
              {opt}
            </p>
          ))}
          {resolved.question.explanation && <p className="mt-1 text-xs text-muted-foreground">{resolved.question.explanation}</p>}
        </div>
      )}
      {resolved?.kind === 'note' && (
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
      {resolved?.kind === 'note' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          View this note →
        </Link>
      )}
      {resolved?.kind === 'flashcard' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          View this flashcard →
        </Link>
      )}
      {resolved?.kind === 'problem' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          View problem &amp; reference solution →
        </Link>
      )}
      {resolved?.kind === 'quiz' && (
        <Link href={resolved.url} className="mt-1 inline-block text-xs text-primary underline underline-offset-2">
          Practice more of this quiz →
        </Link>
      )}

      {/* Quiz questions are graded by selection, not reflected on — nothing to edit here. */}
      {question.kind !== 'quiz' && (
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
      )}
    </div>
  );
}

interface MockInterviewChatProps {
  interviewId?: string;
}

export default function MockInterviewChat({ interviewId: initialInterviewId }: MockInterviewChatProps) {
  const { jobs } = useJobs();
  const { startInterview, submitAnswer, submitQuizAnswer } = useMockInterviews();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local state for active interview ID (starts from prop, updates after creation)
  const [activeInterviewId, setActiveInterviewId] = useState<string | undefined>(initialInterviewId);
  const interview = useLiveQuery(
    () => (activeInterviewId ? mockInterviewsRepository.get(activeInterviewId) : Promise.resolve(null)),
    [activeInterviewId]
  );

  // Phase: 'setup' | 'interview' | 'recap'
  const phase = useMemo(() => {
    if (!activeInterviewId) return 'setup';
    if (interview?.status === 'completed') return 'recap';
    return 'interview';
  }, [activeInterviewId, interview?.status]);

  // Setup state
  const [setupStep, setSetupStep] = useState<SetupStep>('topics');
  const [setupHistory, setSetupHistory] = useState<{ question: string; answer: string }[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [kinds, setKinds] = useState<MockInterviewQuestionKind[]>(['note', 'flashcard', 'problem']);
  const [countText, setCountText] = useState('');
  const [showCustomCount, setShowCustomCount] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [errorNote, setErrorNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [chipsEnabled, setChipsEnabled] = useState(false);

  // Interview state
  const [answerValue, setAnswerValue] = useState('');
  const [inputEnabled, setInputEnabled] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // Typing state
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);

  const interviewerInitials = useMemo(() => {
    if (phase === 'setup') return 'AI';
    if (interview?.persona.name) return getInitials(interview.persona.name);
    return 'AI';
  }, [phase, interview?.persona.name]);

  const personaLabel = useMemo(() => {
    if (phase === 'setup') return 'Interviewer';
    if (interview?.persona.name) return `${interview.persona.name} (${interview.persona.title})`;
    return interview?.persona.title || 'Interviewer';
  }, [phase, interview?.persona]);

  // Auto-scroll to bottom when new content appears
  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on any content change
  useEffect(() => {
    scrollToBottom();
  }, [setupHistory.length, interview?.currentIndex, typingMessageId, inputEnabled, chipsEnabled, scrollToBottom]);

  // Handle interview phase typing (uses TypingIndicator with fixed delay)
  const prevIndexRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (phase !== 'interview' && phase !== 'recap') return;

    const newIndex = interview?.currentIndex;
    if (newIndex !== undefined && newIndex !== prevIndexRef.current) {
      prevIndexRef.current = newIndex;
      setInputEnabled(false);
      setTypingMessageId(null);

      const timer = setTimeout(() => {
        setTypingMessageId('current');
        setTimeout(() => {
          setInputEnabled(true);
          setTypingMessageId(null);
        }, INTERVIEW_TYPING_DELAY_MS);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [phase, interview?.currentIndex]);

  // Trigger first question when transitioning from setup to interview
  useEffect(() => {
    if (phase === 'interview' && prevIndexRef.current === undefined) {
      prevIndexRef.current = 0;
      setInputEnabled(false);
      setTypingMessageId(null);

      const timer = setTimeout(() => {
        setTypingMessageId('current');
        setTimeout(() => {
          setInputEnabled(true);
          setTypingMessageId(null);
        }, INTERVIEW_TYPING_DELAY_MS);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [phase]);

  const toggleTopic = (t: string) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const toggleKind = (k: MockInterviewQuestionKind) => setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  // Called when setup question typing animation completes
  const onSetupTypingComplete = useCallback(() => {
    setChipsEnabled(true);
  }, []);

  const finalizeSetupStep = useCallback((question: string, answer: string, next: SetupStep) => {
    setSetupHistory((h) => [...h, { question, answer }]);
    setSetupStep(next);
    setInputEnabled(false);
    setChipsEnabled(false);
  }, []);

  const createInterview = useCallback(
    async (persona: MockInterviewPersona, count: number) => {
      setSubmitting(true);
      const created = await startInterview({
        topics,
        includeKinds: kinds,
        questionCount: count,
        persona
      });
      setSubmitting(false);

      if (created) {
        // Stay in same chat — set the active interview ID locally
        setActiveInterviewId(created.id);
        setSetupHistory((h) => [...h, { question: 'Interview created!', answer: `Starting with ${count} questions...` }]);
        return;
      }
      setErrorNote('No questions matched those picks — try different topics or question types.');
      setSetupStep('topics');
    },
    [topics, kinds, startInterview]
  );

  const goNext = useCallback(
    (transcript: string) => {
      if (!interview) return;
      const isLast = interview.currentIndex === interview.questions.length - 1;
      submitAnswer(interview.id, interview.currentIndex, transcript, isLast);
      setAnswerValue('');
      setInputEnabled(false);
    },
    [interview, submitAnswer]
  );

  const selectQuizOption = useCallback(
    (optionIndex: number) => {
      if (quizSelected !== null) return; // already answered, feedback showing
      setQuizSelected(optionIndex);
    },
    [quizSelected]
  );

  const goNextQuiz = useCallback(() => {
    if (!interview || quizSelected === null) return;
    const isLast = interview.currentIndex === interview.questions.length - 1;
    submitQuizAnswer(interview.id, interview.currentIndex, quizSelected, isLast);
    setQuizSelected(null);
    setInputEnabled(false);
  }, [interview, quizSelected, submitQuizAnswer]);

  const questionCount = Number(countText);
  const currentQuestion = interview && interview.currentIndex < interview.questions.length ? interview.questions[interview.currentIndex] : null;
  // Resolved once per question (not on every render) — the bottom quiz-answer block below reads this
  // directly instead of re-resolving inline, and reuses the same lookup QuestionBubbleContent needs.
  const currentResolved = useMemo(
    () => (currentQuestion ? resolveContent(currentQuestion.kind, currentQuestion.refId) : null),
    [currentQuestion]
  );

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {phase === 'setup' ? "Set up your mock interview — I'll ask a few quick questions first." : `Interviewing with ${personaLabel}`}
        </p>
      </div>

      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="flex flex-col gap-4 p-4">
          {/* Setup history - read only */}
          {setupHistory.map((h) => (
            <MessageGroup key={`${h.question}:${h.answer}`}>
              <ChatBubble from="bot" avatar={interviewerInitials}>
                {h.question}
              </ChatBubble>
              <ChatBubble from="user">{h.answer}</ChatBubble>
            </MessageGroup>
          ))}

          {errorNote && (
            <ChatBubble from="bot" avatar={interviewerInitials}>
              {errorNote}
            </ChatBubble>
          )}

          {/* ==================== SETUP PHASE ==================== */}
          {phase === 'setup' && setupStep === 'topics' && (
            <div className="flex flex-col gap-2">
              <ChatBubble from="bot" avatar={interviewerInitials} typing={true} typingSpeed={25} onTypingComplete={onSetupTypingComplete}>
                {SETUP_QUESTIONS.topics}
              </ChatBubble>
              <AnimatedChips
                options={MOCK_INTERVIEW_TOPICS.map((t) => ({ value: t.label, label: t.label }))}
                selected={topics}
                onToggle={toggleTopic}
                enabled={chipsEnabled}
                action={
                  topics.length > 0
                    ? { label: 'Continue', onClick: () => finalizeSetupStep(SETUP_QUESTIONS.topics, topics.join(', '), 'kinds') }
                    : undefined
                }
              />
            </div>
          )}

          {phase === 'setup' && setupStep === 'kinds' && (
            <div className="flex flex-col gap-2">
              <ChatBubble from="bot" avatar={interviewerInitials} typing={true} typingSpeed={25} onTypingComplete={onSetupTypingComplete}>
                {SETUP_QUESTIONS.kinds}
              </ChatBubble>
              <AnimatedChips
                options={KIND_OPTIONS}
                selected={kinds}
                onToggle={toggleKind}
                enabled={chipsEnabled}
                action={
                  kinds.length > 0
                    ? {
                        label: 'Continue',
                        onClick: () =>
                          finalizeSetupStep(
                            SETUP_QUESTIONS.kinds,
                            kinds.map((k) => KIND_OPTIONS.find((o) => o.value === k)?.label ?? k).join(', '),
                            'count'
                          )
                      }
                    : undefined
                }
              />
            </div>
          )}

          {phase === 'setup' && setupStep === 'count' && (
            <div className="flex flex-col gap-2">
              <ChatBubble from="bot" avatar={interviewerInitials} typing={true} typingSpeed={25} onTypingComplete={onSetupTypingComplete}>
                {SETUP_QUESTIONS.count}
              </ChatBubble>
              {showCustomCount ? (
                <ChatInput
                  value={countText}
                  onChange={setCountText}
                  placeholder="Enter a number (1–50)"
                  onSubmit={(v) => {
                    const n = Number(v);
                    if (!Number.isInteger(n) || n < 1 || n > 50) return;
                    setCountText(v);
                    finalizeSetupStep(SETUP_QUESTIONS.count, v, 'personaMode');
                  }}
                />
              ) : (
                <AnimatedChips
                  options={[...COUNT_PRESETS.map((v) => ({ value: v, label: v })), { value: 'custom', label: 'Custom' }]}
                  selected={[]}
                  onToggle={(v) => {
                    if (v === 'custom') {
                      setShowCustomCount(true);
                      return;
                    }
                    setCountText(v);
                    finalizeSetupStep(SETUP_QUESTIONS.count, v, 'personaMode');
                  }}
                  enabled={chipsEnabled}
                />
              )}
            </div>
          )}

          {phase === 'setup' && setupStep === 'personaMode' && (
            <div className="flex flex-col gap-2">
              <ChatBubble from="bot" avatar={interviewerInitials} typing={true} typingSpeed={25} onTypingComplete={onSetupTypingComplete}>
                {SETUP_QUESTIONS.personaMode}
              </ChatBubble>
              <AnimatedChips
                options={[{ value: 'manual', label: 'Manual' }, ...(jobs.length > 0 ? [{ value: 'job', label: 'From Job Tracker' }] : [])]}
                selected={[]}
                onToggle={(v) => {
                  finalizeSetupStep(
                    SETUP_QUESTIONS.personaMode,
                    v === 'job' ? 'From Job Tracker' : 'Manual',
                    v === 'job' ? 'personaJob' : 'personaName'
                  );
                }}
                enabled={chipsEnabled}
              />
            </div>
          )}

          {phase === 'setup' && setupStep === 'personaJob' && (
            <div className="flex flex-col gap-2">
              <ChatBubble from="bot" avatar={interviewerInitials} typing={true} typingSpeed={25} onTypingComplete={onSetupTypingComplete}>
                {SETUP_QUESTIONS.personaJob}
              </ChatBubble>
              <AnimatedChips
                options={jobs.map((j) => ({ value: j.id, label: `${j.companyName} — ${j.jobTitle}` }))}
                selected={[]}
                onToggle={(jobId) => {
                  const job = jobs.find((j) => j.id === jobId);
                  if (!job) return;
                  const label = `${job.companyName} — ${job.jobTitle}`;
                  setSetupHistory((h) => [...h, { question: SETUP_QUESTIONS.personaJob, answer: label }]);
                  createInterview({ name: '', title: label, jobId: job.id }, questionCount);
                }}
                enabled={chipsEnabled}
              />
            </div>
          )}

          {phase === 'setup' && setupStep === 'personaName' && (
            <div className="flex flex-col gap-2">
              <ChatBubble
                from="bot"
                avatar={interviewerInitials}
                typing={true}
                typingSpeed={25}
                onTypingComplete={() => setInputEnabled(true)}
              >
                {SETUP_QUESTIONS.personaName}
              </ChatBubble>
              {inputEnabled && (
                <ChatInput
                  value={manualName}
                  onChange={setManualName}
                  placeholder="Priya"
                  allowEmpty
                  onSubmit={(v) => {
                    setManualName(v);
                    finalizeSetupStep(SETUP_QUESTIONS.personaName, v || '(skipped)', 'personaTitle');
                  }}
                />
              )}
            </div>
          )}

          {phase === 'setup' && setupStep === 'personaTitle' && (
            <div className="flex flex-col gap-2">
              <ChatBubble
                from="bot"
                avatar={interviewerInitials}
                typing={true}
                typingSpeed={25}
                onTypingComplete={() => setInputEnabled(true)}
              >
                {SETUP_QUESTIONS.personaTitle}
              </ChatBubble>
              {inputEnabled && (
                <ChatInput
                  value={manualTitle}
                  onChange={setManualTitle}
                  placeholder="Senior Frontend Engineer"
                  allowEmpty
                  onSubmit={(v) => {
                    const finalName = manualName.trim() || 'Interviewer';
                    const finalTitle = v.trim() || 'Mock Interviewer';
                    setSetupHistory((h) => [...h, { question: SETUP_QUESTIONS.personaTitle, answer: v || '(skipped)' }]);
                    createInterview({ name: finalName, title: finalTitle }, questionCount);
                  }}
                />
              )}
            </div>
          )}

          {submitting && <p className="text-xs text-muted-foreground">Building your interview…</p>}

          {/* ==================== INTERVIEW PHASE ==================== */}
          {phase === 'interview' && interview && (
            <>
              {/* Completed questions - read only */}
              {interview.questions.slice(0, interview.currentIndex).map((q) => (
                <MessageGroup key={`${q.kind}:${q.refId}`}>
                  <ChatBubble from="bot" avatar={interviewerInitials}>
                    <QuestionBubbleContent question={q} revealAnswer />
                  </ChatBubble>
                  <ChatBubble from="user">{q.reflection || '(no answer recorded)'}</ChatBubble>
                </MessageGroup>
              ))}

              {/* Current question - interactive */}
              {interview.currentIndex < interview.questions.length && (
                <div className="flex flex-col gap-2">
                  <Progress value={(interview.currentIndex / interview.questions.length) * 100} />
                  <p className="text-xs text-muted-foreground">
                    Question {interview.currentIndex + 1} of {interview.questions.length}
                  </p>
                  {typingMessageId === 'current' ? (
                    <ChatBubble from="bot" avatar={interviewerInitials}>
                      <TypingIndicator />
                    </ChatBubble>
                  ) : (
                    <div className="animate-in fade-in duration-300">
                      <ChatBubble from="bot" avatar={interviewerInitials}>
                        <QuestionBubbleContent question={interview.questions[interview.currentIndex]} />
                      </ChatBubble>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ==================== RECAP PHASE ==================== */}
          {phase === 'recap' && interview && (
            <>
              <ChatBubble from="bot" avatar={interviewerInitials}>
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
              <Link href="/mock-interview" className="mt-2 inline-block">
                <Button variant="outline" size="sm">
                  <IconArrowLeft className="mr-1 size-4" />
                  Back to Interviews
                </Button>
              </Link>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Input at bottom - only for current question in interview phase */}
      {phase === 'interview' && inputEnabled && interview && currentQuestion?.kind === 'quiz' && currentResolved?.kind === 'quiz' && (
        <div className="border-t p-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-2">
            {currentResolved.question.options.map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => selectQuizOption(i)}
                disabled={quizSelected !== null}
                className={`w-full rounded-lg border-2 px-4 py-2.5 text-left text-sm transition-colors disabled:cursor-default ${quizOptionClasses({ isSelected: quizSelected === i, isCorrect: i === currentResolved.question.correctIndex, revealed: quizSelected !== null })}`}
              >
                {opt}
              </button>
            ))}
            {quizSelected !== null && currentResolved.question.explanation && (
              <p className="text-xs text-muted-foreground">{currentResolved.question.explanation}</p>
            )}
            {quizSelected !== null && (
              <div className="flex justify-end">
                <Button onClick={goNextQuiz} size="sm">
                  {interview.currentIndex === interview.questions.length - 1 ? 'Finish' : 'Next question'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {phase === 'interview' && inputEnabled && interview && currentQuestion?.kind !== 'quiz' && (
        <div className="border-t p-4">
          <ChatInput
            key={interview.currentIndex}
            value={answerValue}
            onChange={setAnswerValue}
            onSubmit={goNext}
            mic
            allowEmpty
            placeholder="Type or speak your answer…"
          />
        </div>
      )}
    </div>
  );
}
