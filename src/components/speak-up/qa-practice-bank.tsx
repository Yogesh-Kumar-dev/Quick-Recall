'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { Briefcase, Pencil, Play, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { predefinedQuestions } from '@/data/speak-up-questions';
import * as jobsRepository from '@/db/jobs';
import type { JobApplication } from '@/types/job-tracker';
import type { SpeakUpQA, SpeakUpQAInput } from '@/types/speak-up';
import QAFormDrawer from './qa-form-drawer';
import useSpeakUpQAs from './use-speak-up-qas';

// ==============================|| SPEAK UP - Q&A BANK ("UP NEXT") ||============================== //

const ALL = 'all';

interface QAPracticeBankProps {
  activeIndex: number;
  onSelectQuestion: (index: number) => void;
}

interface DrawerState {
  mode: 'add' | 'edit';
  initialValues?: SpeakUpQA | null;
  sourceId?: string;
  questionLocked?: boolean;
}

function Answer({ answer, isActive }: { answer: string; isActive: boolean }) {
  const canToggle = answer.length > 120 || answer.includes('\n');
  const [open, setOpen] = useState(isActive);

  if (!canToggle) {
    return <p className="text-xs whitespace-pre-wrap text-muted-foreground">{answer}</p>;
  }

  return (
    <div>
      <p className={cn('text-xs whitespace-pre-wrap text-muted-foreground', !open && 'line-clamp-2')}>{answer}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="mt-0.5 text-xs font-medium text-primary hover:underline"
      >
        {open ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

export default function QAPracticeBank({ activeIndex, onSelectQuestion }: QAPracticeBankProps) {
  const { qas, addQA, editQA, deleteQA } = useSpeakUpQAs();
  // memoized fallback keeps a stable reference so the jobById memo below doesn't re-run every render
  const jobsQuery = useLiveQuery(() => jobsRepository.getAll());
  const jobs = useMemo(() => jobsQuery ?? [], [jobsQuery]);

  const [drawer, setDrawer] = useState<DrawerState | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SpeakUpQA | null>(null);
  const [filter, setFilter] = useState<string>(ALL);

  const answerBySource = useMemo(() => {
    const map = new Map<string, SpeakUpQA>();
    qas.forEach((qa) => {
      if (qa.sourceId) map.set(qa.sourceId, qa);
    });
    return map;
  }, [qas]);

  const jobById = useMemo(() => {
    const map = new Map<string, JobApplication>();
    jobs.forEach((job) => {
      map.set(job.id, job);
    });
    return map;
  }, [jobs]);

  const userQAs = useMemo(() => qas.filter((qa) => !qa.sourceId), [qas]);

  const allTags = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    const add = (t?: string) => {
      const v = t?.trim();
      if (v && !seen.has(v)) {
        seen.add(v);
        list.push(v);
      }
    };
    predefinedQuestions.forEach((p) => {
      add(p.category);
    });
    userQAs.forEach((q) => {
      add(q.tag);
    });
    return list;
  }, [userQAs]);

  useEffect(() => {
    if (filter !== ALL && !allTags.includes(filter)) setFilter(ALL);
  }, [filter, allTags]);

  const visiblePredefined = useMemo(
    () =>
      predefinedQuestions.map((predef, index) => ({ predef, index })).filter(({ predef }) => filter === ALL || predef.category === filter),
    [filter]
  );
  const visibleUserQAs = useMemo(() => userQAs.filter((qa) => filter === ALL || qa.tag === filter), [userQAs, filter]);

  // when the active question is filtered out, fall back to the first still-visible one
  useEffect(() => {
    if (filter === ALL) return;
    const activeVisible = visiblePredefined.some(({ index }) => index === activeIndex);
    if (!activeVisible && visiblePredefined.length > 0) {
      onSelectQuestion(visiblePredefined[0].index);
    }
  }, [filter, visiblePredefined, activeIndex, onSelectQuestion]);

  const activeRowRef = useRef<HTMLDivElement | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll the active row into view on index change
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeIndex]);

  const handleSubmit = async (values: SpeakUpQAInput) => {
    if (drawer?.mode === 'edit' && drawer.initialValues) {
      await editQA(drawer.initialValues.id, values);
    } else {
      await addQA(values);
    }
  };

  const jobBadge = (jobId?: string) => {
    if (!jobId) return null;
    const job = jobById.get(jobId);
    if (!job) return null; // job deleted — hide the badge instead of erroring
    return (
      <Badge variant="outline" className="max-w-full gap-1">
        <Briefcase className="size-3 shrink-0" />
        <span className="truncate">
          {job.companyName} — {job.jobTitle}
        </span>
      </Badge>
    );
  };

  const rowClass = 'flex flex-col gap-1.5 rounded-lg border bg-card p-3 transition-colors';

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 shrink-0">
        <h4 className="text-base font-bold">Question bank</h4>
        <p className="text-sm text-muted-foreground">Tap a question to rehearse it, or prepare your own answer.</p>
      </div>

      {allTags.length > 0 && (
        <div className="mb-3 flex shrink-0 gap-2 overflow-x-auto py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterChip label="All" active={filter === ALL} onClick={() => setFilter(ALL)} />
          {allTags.map((tag) => (
            <FilterChip key={tag} label={tag} active={filter === tag} onClick={() => setFilter(tag)} />
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setDrawer({ mode: 'add' })}
        className="mb-3 flex shrink-0 items-center gap-1.5 rounded-lg border-2 border-dashed p-3 text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="size-5" />
        <span className="text-sm font-bold">Add your own question</span>
      </button>

      <div className="flex grow flex-col gap-3 overflow-y-auto pr-1">
        {visiblePredefined.map(({ predef, index }) => {
          const saved = answerBySource.get(predef.id);
          const isActive = index === activeIndex;
          return (
            // biome-ignore lint/a11y/useSemanticElements: nested action buttons forbid a <button> wrapper
            <div
              key={predef.id}
              ref={isActive ? activeRowRef : undefined}
              role="button"
              tabIndex={0}
              onClick={() => onSelectQuestion(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectQuestion(index);
                }
              }}
              className={cn(
                rowClass,
                'cursor-pointer hover:border-primary',
                isActive && 'border-primary bg-primary/5 shadow-[0_0_0_1px_var(--color-primary)]'
              )}
            >
              <div className="flex items-start gap-2">
                {isActive && <Play className="mt-0.5 size-4 shrink-0 fill-current text-primary" />}
                <div className="min-w-0 grow">
                  {predef.category && (
                    <Badge variant="secondary" className="mb-1">
                      {predef.category}
                    </Badge>
                  )}
                  <p className="text-sm leading-snug font-bold">{predef.question}</p>
                </div>
              </div>

              {saved && <Answer answer={saved.answer} isActive={isActive} />}

              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">{saved && jobBadge(saved.jobId)}</div>
                {/* biome-ignore lint/a11y/noStaticElementInteractions: propagation guard for row-select */}
                <div className="flex shrink-0 gap-0.5" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  {saved ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit answer"
                        onClick={() => setDrawer({ mode: 'edit', initialValues: saved, questionLocked: true })}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive"
                        aria-label="Delete answer"
                        onClick={() => setPendingDelete(saved)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      onClick={() =>
                        setDrawer({
                          mode: 'add',
                          initialValues: { question: predef.question } as SpeakUpQA,
                          sourceId: predef.id,
                          questionLocked: true
                        })
                      }
                    >
                      <Plus className="size-3.5" /> Prepare answer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {visibleUserQAs.map((qa) => (
          <div key={qa.id} className={rowClass}>
            <Badge variant="outline" className="self-start text-primary">
              {qa.tag?.trim() || 'Your question'}
            </Badge>
            <p className="text-sm leading-snug font-bold">{qa.question}</p>
            <Answer answer={qa.answer} isActive={false} />
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">{jobBadge(qa.jobId)}</div>
              <div className="flex shrink-0 gap-0.5">
                <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={() => setDrawer({ mode: 'edit', initialValues: qa })}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  aria-label="Delete"
                  onClick={() => setPendingDelete(qa)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {drawer && (
        <QAFormDrawer
          open={Boolean(drawer)}
          mode={drawer.mode}
          initialValues={drawer.initialValues}
          sourceId={drawer.sourceId}
          questionLocked={drawer.questionLocked}
          tagOptions={allTags}
          jobs={jobs}
          onClose={() => setDrawer(null)}
          onSubmit={handleSubmit}
        />
      )}

      <Dialog open={Boolean(pendingDelete)} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete this answer?</DialogTitle>
            <DialogDescription>
              {pendingDelete ? `Your saved answer to “${pendingDelete.question}” will be permanently removed. This can’t be undone.` : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (pendingDelete) {
                  await deleteQA(pendingDelete.id);
                  setPendingDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground hover:border-primary hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}
