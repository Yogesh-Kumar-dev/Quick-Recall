'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import useJobs from '@/components/job-tracker/use-jobs';
import { makeId } from '@/lib/id';
import useMockInterviews from './use-mock-interviews';
import { MOCK_INTERVIEW_TOPICS } from '@/data/mock-interview-pool';
import { ChatBubble } from './chat/chat-bubble';
import { QuickReplyChips } from './chat/quick-reply-chips';
import { ChatInput } from './chat/chat-input';
import type { MockInterviewPersona, MockInterviewQuestionKind } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW — SETUP CHAT ||============================== //

// Replaces the old StartInterviewDialog form: the same inputs (topics, kinds, count, persona),
// asked one at a time as a chat conversation. Answered steps collapse into a static bot/user
// bubble pair; the current step renders its live control (quick-reply chips or a text input).

const KIND_OPTIONS: { value: MockInterviewQuestionKind; label: string }[] = [
  { value: 'note', label: 'Notes' },
  { value: 'flashcard', label: 'Flashcards' },
  { value: 'problem', label: 'Machine Coding' }
];

const COUNT_PRESETS = ['5', '10', '15', '20'];

type Step = 'topics' | 'kinds' | 'count' | 'personaMode' | 'personaJob' | 'personaName' | 'personaTitle';

const QUESTIONS: Record<Step, string> = {
  topics: 'Which topics do you want to be quizzed on?',
  kinds: 'What kinds of questions should I include?',
  count: 'How many questions should we go through?',
  personaMode: "Who's interviewing you today?",
  personaJob: 'Which job is this for?',
  personaName: "What's your interviewer's name? (optional)",
  personaTitle: 'And their title? (optional)'
};

interface HistoryEntry {
  id: string;
  question: string;
  answer: string;
}

export default function SetupChat() {
  const router = useRouter();
  const { jobs } = useJobs();
  const { startInterview } = useMockInterviews();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [step, setStep] = useState<Step>('topics');
  const [errorNote, setErrorNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [topics, setTopics] = useState<string[]>([]);
  const [kinds, setKinds] = useState<MockInterviewQuestionKind[]>(['note', 'flashcard', 'problem']);
  const [countText, setCountText] = useState('');
  const [showCustomCount, setShowCustomCount] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualTitle, setManualTitle] = useState('');

  const toggleTopic = (t: string) => setTopics((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  const toggleKind = (k: MockInterviewQuestionKind) => setKinds((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));

  const finalizeStep = (question: string, answer: string, next: Step) => {
    setHistory((h) => [...h, { id: makeId(), question, answer }]);
    setStep(next);
  };

  const start = async (persona: MockInterviewPersona, count: number) => {
    setSubmitting(true);
    const interview = await startInterview({ topics, includeKinds: kinds, questionCount: count, persona });
    setSubmitting(false);
    if (interview) {
      router.replace(`/mock-interview/${interview.id}`);
      return;
    }
    setErrorNote('No questions matched those picks — try different topics or question types.');
    setStep('topics');
  };

  const questionCount = Number(countText);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
      <p className="text-sm text-muted-foreground">Set up your mock interview — I&apos;ll ask a few quick questions first.</p>

      {history.map((h) => (
        <div key={h.id} className="flex flex-col gap-2">
          <ChatBubble from="bot">{h.question}</ChatBubble>
          <ChatBubble from="user">{h.answer}</ChatBubble>
        </div>
      ))}

      {errorNote && <ChatBubble from="bot">{errorNote}</ChatBubble>}

      {step === 'topics' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.topics}</ChatBubble>
          <QuickReplyChips
            options={MOCK_INTERVIEW_TOPICS.map((t) => ({ value: t.label, label: t.label }))}
            selected={topics}
            onToggle={toggleTopic}
            action={
              topics.length > 0
                ? { label: 'Continue', onClick: () => finalizeStep(QUESTIONS.topics, topics.join(', '), 'kinds') }
                : undefined
            }
          />
        </div>
      )}

      {step === 'kinds' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.kinds}</ChatBubble>
          <QuickReplyChips
            options={KIND_OPTIONS}
            selected={kinds}
            onToggle={toggleKind}
            action={
              kinds.length > 0
                ? {
                    label: 'Continue',
                    onClick: () =>
                      finalizeStep(
                        QUESTIONS.kinds,
                        kinds.map((k) => KIND_OPTIONS.find((o) => o.value === k)?.label ?? k).join(', '),
                        'count'
                      )
                  }
                : undefined
            }
          />
        </div>
      )}

      {step === 'count' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.count}</ChatBubble>
          {showCustomCount ? (
            <ChatInput
              value={countText}
              onChange={setCountText}
              placeholder="Enter a number (1–50)"
              onSubmit={(v) => {
                const n = Number(v);
                if (!Number.isInteger(n) || n < 1 || n > 50) return;
                setCountText(v);
                finalizeStep(QUESTIONS.count, v, 'personaMode');
              }}
            />
          ) : (
            <QuickReplyChips
              options={[...COUNT_PRESETS.map((v) => ({ value: v, label: v })), { value: 'custom', label: 'Custom' }]}
              selected={[]}
              onToggle={(v) => {
                if (v === 'custom') {
                  setShowCustomCount(true);
                  return;
                }
                setCountText(v);
                finalizeStep(QUESTIONS.count, v, 'personaMode');
              }}
            />
          )}
        </div>
      )}

      {step === 'personaMode' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.personaMode}</ChatBubble>
          <QuickReplyChips
            options={[{ value: 'manual', label: 'Manual' }, ...(jobs.length > 0 ? [{ value: 'job', label: 'From Job Tracker' }] : [])]}
            selected={[]}
            onToggle={(v) =>
              finalizeStep(QUESTIONS.personaMode, v === 'job' ? 'From Job Tracker' : 'Manual', v === 'job' ? 'personaJob' : 'personaName')
            }
          />
        </div>
      )}

      {step === 'personaJob' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.personaJob}</ChatBubble>
          <QuickReplyChips
            options={jobs.map((j) => ({ value: j.id, label: `${j.companyName} — ${j.jobTitle}` }))}
            selected={[]}
            onToggle={(jobId) => {
              const job = jobs.find((j) => j.id === jobId);
              if (!job) return;
              const label = `${job.companyName} — ${job.jobTitle}`;
              setHistory((h) => [...h, { id: makeId(), question: QUESTIONS.personaJob, answer: label }]);
              start({ name: '', title: label, jobId: job.id }, questionCount);
            }}
          />
        </div>
      )}

      {step === 'personaName' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.personaName}</ChatBubble>
          <ChatInput
            value={manualName}
            onChange={setManualName}
            placeholder="Priya"
            allowEmpty
            onSubmit={(v) => {
              setManualName(v);
              finalizeStep(QUESTIONS.personaName, v || '(skipped)', 'personaTitle');
            }}
          />
        </div>
      )}

      {step === 'personaTitle' && (
        <div className="flex flex-col gap-2">
          <ChatBubble from="bot">{QUESTIONS.personaTitle}</ChatBubble>
          <ChatInput
            value={manualTitle}
            onChange={setManualTitle}
            placeholder="Senior Frontend Engineer"
            allowEmpty
            onSubmit={(v) => {
              setHistory((h) => [...h, { id: makeId(), question: QUESTIONS.personaTitle, answer: v || '(skipped)' }]);
              start({ name: manualName.trim() || 'Interviewer', title: v.trim() || 'Mock Interviewer' }, questionCount);
            }}
          />
        </div>
      )}

      {submitting && <p className="text-xs text-muted-foreground">Building your interview…</p>}
    </div>
  );
}
