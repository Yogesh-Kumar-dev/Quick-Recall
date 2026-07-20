'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IconMessageQuestion, IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import useMockInterviews from './use-mock-interviews';
import type { MockInterview } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW ||============================== //

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function InterviewRow({ interview, onOpen }: { interview: MockInterview; onOpen: () => void }) {
  const answered = interview.questions.filter((q) => q.answeredAt).length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left hover:bg-accent/50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">
          {interview.persona.name ? `${interview.persona.name} — ` : ''}
          {interview.persona.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {interview.topics.join(', ')} · {formatDate(interview.startedAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-xs text-muted-foreground">
          {answered}/{interview.questions.length}
        </span>
        <Badge variant={interview.status === 'completed' ? 'default' : 'secondary'}>
          {interview.status === 'completed' ? 'Completed' : 'In progress'}
        </Badge>
      </div>
    </button>
  );
}

export default function MockInterviewView() {
  const { interviews, loading } = useMockInterviews();
  const router = useRouter();

  const completedCount = useMemo(() => interviews.filter((i) => i.status === 'completed').length, [interviews]);

  const openInterview = (id: string) => router.push(`/mock-interview/${id}`);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mock Interview</h1>
          <p className="mt-1 text-muted-foreground">
            A simulated interview drawn from your notes, flashcards and machine-coding problems — speak each answer out loud as it's
            captured, then reflect on the whole transcript afterward. No grading.
          </p>
        </div>
        <Button className="gap-1.5 shrink-0" onClick={() => router.push('/mock-interview/new')}>
          <IconPlus className="size-4" /> Start Interview
        </Button>
      </div>

      {loading ? null : interviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <IconMessageQuestion size={40} className="mx-auto opacity-50" />
          <h2 className="mt-4 text-xl font-semibold">No mock interviews yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">Start one above to practice with a bounded set of interview-style questions.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            {completedCount} completed interview{completedCount === 1 ? '' : 's'}
          </p>
          <div className="flex flex-col gap-2">
            {interviews.map((i) => (
              <InterviewRow key={i.id} interview={i} onOpen={() => openInterview(i.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
