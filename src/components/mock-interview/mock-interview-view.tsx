'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconMessageQuestion, IconPlus } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import useJobs from '@/components/job-tracker/use-jobs';
import { ChipFilter } from '@/components/job-tracker/chip-filter';
import useMockInterviews from './use-mock-interviews';
import { MOCK_INTERVIEW_TOPICS } from '@/data/mock-interview-pool';
import type { MockInterview, MockInterviewInput, MockInterviewQuestionKind } from '@/types/mock-interview';

// ==============================|| MOCK INTERVIEW ||============================== //

const KIND_OPTIONS: { value: MockInterviewQuestionKind; label: string }[] = [
  { value: 'note', label: 'Notes' },
  { value: 'flashcard', label: 'Flashcards' },
  { value: 'problem', label: 'Machine Coding' }
];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function StartInterviewDialog({ open, onClose, onStarted }: { open: boolean; onClose: () => void; onStarted: (id: string) => void }) {
  const { jobs } = useJobs();
  const { startInterview } = useMockInterviews();

  const [topics, setTopics] = useState<string[]>([]);
  const [kinds, setKinds] = useState<MockInterviewQuestionKind[]>(['note', 'flashcard', 'problem']);
  const [questionCount, setQuestionCount] = useState('10');
  const [personaMode, setPersonaMode] = useState<'job' | 'manual'>('manual');
  const [jobId, setJobId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleTopic = (label: string) => setTopics((t) => (t.includes(label) ? t.filter((x) => x !== label) : [...t, label]));
  const toggleKind = (kind: MockInterviewQuestionKind) => setKinds((k) => (k.includes(kind) ? k.filter((x) => x !== kind) : [...k, kind]));

  const canSubmit = topics.length > 0 && kinds.length > 0 && Number(questionCount) > 0;

  const handleSubmit = async () => {
    let persona: MockInterviewInput['persona'];
    if (personaMode === 'job') {
      const job = jobs.find((j) => j.id === jobId);
      if (!job) return;
      persona = { name: '', title: `${job.companyName} — ${job.jobTitle}`, jobId: job.id };
    } else {
      persona = { name: manualName.trim() || 'Interviewer', title: manualTitle.trim() || 'Mock Interviewer' };
    }

    setSubmitting(true);
    const interview = await startInterview({ topics, includeKinds: kinds, questionCount: Number(questionCount), persona });
    setSubmitting(false);
    if (interview) onStarted(interview.id);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Start Mock Interview</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <Label>Topics</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {MOCK_INTERVIEW_TOPICS.map((t) => (
                <ChipFilter key={t.label} active={topics.includes(t.label)} label={t.label} onClick={() => toggleTopic(t.label)} />
              ))}
            </div>
          </div>

          <div>
            <Label>Question types</Label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {KIND_OPTIONS.map((k) => (
                <ChipFilter key={k.value} active={kinds.includes(k.value)} label={k.label} onClick={() => toggleKind(k.value)} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="questionCount">Number of questions</Label>
            <Input
              id="questionCount"
              type="number"
              min={1}
              max={50}
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              className="w-24"
            />
          </div>

          <div>
            <Label>Interviewer persona</Label>
            <div className="mt-1.5 flex gap-1.5">
              <ChipFilter active={personaMode === 'manual'} label="Manual" onClick={() => setPersonaMode('manual')} />
              <ChipFilter active={personaMode === 'job'} label="From Job Tracker" onClick={() => setPersonaMode('job')} />
            </div>
          </div>

          {personaMode === 'manual' ? (
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="manualName">Name</Label>
                <Input id="manualName" placeholder="Priya" value={manualName} onChange={(e) => setManualName(e.target.value)} />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="manualTitle">Title</Label>
                <Input
                  id="manualTitle"
                  placeholder="Senior Frontend Engineer"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label>Job</Label>
              <Select value={jobId} onValueChange={(v) => setJobId(v ?? '')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a job…" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.companyName} — {job.jobTitle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {jobs.length === 0 && <p className="text-xs text-muted-foreground">No jobs tracked yet — add one in Job Tracker first.</p>}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || submitting || (personaMode === 'job' && !jobId)}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  const [startOpen, setStartOpen] = useState(false);

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
        <Button className="gap-1.5 shrink-0" onClick={() => setStartOpen(true)}>
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

      <StartInterviewDialog open={startOpen} onClose={() => setStartOpen(false)} onStarted={openInterview} />
    </div>
  );
}
