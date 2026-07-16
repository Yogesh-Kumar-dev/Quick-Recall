'use client';

import { usePathname } from 'next/navigation';
import { type ComponentRef, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import CodeBlock from '@/components/content/code-block';
import * as attemptsRepository from '@/db/attempts';
import * as reviewsRepository from '@/db/reviews';
import { initialReviewState, review as schedule, formatDuePhrase, formatInterval } from '@/lib/review-scheduler';
import { jsProblems } from '@/data/javascript/js-problems';
import { reactMcProblems } from '@/data/react/react-mc-problems';
import type { CodeLang } from '@/components/content/code-highlighted';
import type { ReviewQuality } from '@/types/study';
import type { PracticeSession } from './use-practice-session';

// ==============================|| PRACTICE PANEL (timed attempt + self-grade) ||============================== //

// The daily-practice loop: write the solution from scratch under a countdown, self-grade
// against the revealed solution, and the problem re-enters the SRS queue (`problem:${slug}`).

// CodeMirror is heavy — lazy-load it only when a session starts. React.lazy (not next/dynamic)
// because the ref must reach the editor for getContents(); it never renders during prerender
// since the idle state shows only the Start screen.
const CodeEditor = lazy(() => import('@leafygreen-ui/code-editor').then((m) => ({ default: m.CodeEditor })));

const DURATION_MIN = { easy: 15, medium: 25, hard: 40 } as const;

// LeafyGreen doesn't export its CodeEditorHandle type — derive it from the component.
type CodeEditorHandle = ComponentRef<typeof CodeEditor>;

// Same look as the /review rating bar.
const RATINGS: { quality: ReviewQuality; label: string; className: string }[] = [
  { quality: 'again', label: 'Again', className: 'text-destructive border-destructive/40' },
  { quality: 'hard', label: 'Hard', className: 'text-[color:var(--chart-4)] border-[color:var(--chart-4)]/40' },
  { quality: 'good', label: 'Good', className: 'text-primary border-primary/40' },
  { quality: 'easy', label: 'Easy', className: 'text-[color:var(--chart-2)] border-[color:var(--chart-2)]/40' }
];

function formatClock(totalSec: number): string {
  const abs = Math.abs(totalSec);
  const mm = Math.floor(abs / 60);
  const ss = String(abs % 60).padStart(2, '0');
  return `${totalSec < 0 ? '-' : ''}${mm}:${ss}`;
}

interface Props {
  session: PracticeSession;
  solutionCode: string;
  language: CodeLang;
}

export default function PracticePanel({ session, solutionCode, language }: Props) {
  // Route shape is /js/machine-coding/<slug> or /react/machine-coding/<slug>; breaks silently
  // if these routes ever move — update the regex with them.
  const pathname = usePathname();
  const match = pathname.match(/\/(js|react)\/machine-coding\/([^/?#]+)/);
  const kind = (match?.[1] ?? 'js') as 'js' | 'react';
  const slug = match?.[2] ?? '';

  const registry = kind === 'js' ? jsProblems : reactMcProblems;
  const difficulty = registry.find((p) => p.slug === slug)?.difficulty ?? 'medium';
  const durationMin = DURATION_MIN[difficulty];

  // The editor's onChange is unreliable across its lazy module loading, so the source of
  // truth is getContents() on the ref, captured at submit/give-up time. The draft only
  // persists at those moments — a mid-session reload loses unsubmitted typing.
  const draftKey = `practice-draft:${slug}`;
  const editorRef = useRef<CodeEditorHandle>(null);
  const [code, setCode] = useState(() => (typeof window === 'undefined' ? '' : (localStorage.getItem(draftKey) ?? '')));
  const reviewState = useLiveQuery(() => reviewsRepository.get(slug, 'problem'), [slug]);

  const captureCode = (): string => {
    const written = editorRef.current?.getContents() ?? code;
    setCode(written);
    localStorage.setItem(draftKey, written);
    return written;
  };

  // ?practice=1 (from /review or the dashboard) auto-starts one session. Read post-mount
  // instead of via nuqs — these pages are SSG'd and useSearchParams would force a Suspense
  // boundary into every problem view.
  const autoStarted = useRef(false);
  useEffect(() => {
    const wantsPractice = new URLSearchParams(window.location.search).get('practice') === '1';
    if (wantsPractice && session.status === 'idle' && !autoStarted.current) {
      autoStarted.current = true;
      session.start(durationMin);
    }
  }, [session, durationMin]);

  const grade = async (quality: ReviewQuality, gaveUp: boolean, writtenCode: string = code) => {
    const now = Date.now();
    try {
      // put() covers first-time enrollment and rescheduling alike; existing state (via the
      // live query) preserves progress across attempts.
      const base = reviewState ?? initialReviewState(slug, now, 'problem');
      const next = schedule(base, quality, now);
      await reviewsRepository.upsertAfterReview(next);
      await attemptsRepository.logAttempt({
        id: crypto.randomUUID(),
        refId: slug,
        kind,
        startedAt: session.startedAt,
        durationSec: Math.round((now - session.startedAt) / 1000),
        quality,
        gaveUp,
        code: writtenCode
      });
      toast.success(`Attempt logged — this problem is back ${formatDuePhrase(next.intervalMinutes)}.`);
    } catch {
      toast.error('Could not save your attempt.');
    }
    session.markGraded();
  };

  const practiceAgain = () => {
    localStorage.removeItem(draftKey);
    setCode('');
    session.reset();
  };

  if (session.status === 'idle') {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <h3 className="text-lg font-semibold">Practice this problem</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Write the solution from scratch under a {durationMin}-minute countdown — the solution stays locked until you submit. Grade
          yourself honestly and it comes back via spaced repetition.
        </p>
        <Button size="lg" className="mt-5" onClick={() => session.start(durationMin)}>
          Start ({durationMin} min)
        </Button>
      </div>
    );
  }

  if (session.status === 'active' || session.status === 'submitted') {
    return (
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span
            className={`font-mono text-lg font-semibold tabular-nums ${session.secondsLeft < 0 ? 'text-destructive' : session.secondsLeft < 120 ? 'text-[color:var(--chart-4)]' : ''}`}
          >
            {session.status === 'submitted' ? 'Done — grade yourself' : formatClock(session.secondsLeft)}
          </span>
          {session.status === 'active' && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => grade('again', true, captureCode())}>
                Give up
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  captureCode();
                  session.submit();
                }}
              >
                Submit
              </Button>
            </div>
          )}
        </div>

        <Suspense fallback={<div className="flex h-80 items-center justify-center text-sm text-muted-foreground">Loading editor…</div>}>
          <CodeEditor
            ref={editorRef}
            defaultValue={code}
            language={kind === 'js' ? 'javascript' : 'jsx'}
            minHeight="320px"
            maxHeight="60vh"
            darkMode
          />
        </Suspense>

        {session.status === 'submitted' && (
          <div className="mt-4">
            <p className="mb-2 text-center text-sm text-muted-foreground">
              Compare with the solution in the Code tab, then rate how it went:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {RATINGS.map((r) => {
                const preview = schedule(reviewState ?? initialReviewState(slug, Date.now(), 'problem'), r.quality, Date.now());
                return (
                  <Button
                    key={r.quality}
                    variant="outline"
                    onClick={() => grade(r.quality, false)}
                    className={`flex h-auto flex-col gap-0.5 py-2 leading-tight ${r.className}`}
                  >
                    {r.label}
                    <span className="text-xs opacity-80">{formatInterval(preview.intervalMinutes)}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // graded — your attempt vs the real solution, stacked.
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Your attempt</h3>
        <Button variant="outline" size="sm" onClick={practiceAgain}>
          Practice again
        </Button>
      </div>
      <CodeBlock code={code || '// (no code written)'} language={language} />
      <h3 className="mb-2 mt-6 text-sm font-bold uppercase tracking-wide text-muted-foreground">Solution</h3>
      <CodeBlock code={solutionCode} language={language} />
    </div>
  );
}
