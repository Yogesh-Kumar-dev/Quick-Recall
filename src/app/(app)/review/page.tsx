'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBrain, IconChecks, IconCode } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import * as reviewsRepository from '@/db/reviews';
import { review as schedule, formatInterval, formatDuePhrase } from '@/lib/review-scheduler';
import { flashcardByKey } from '@/data/flashcards-index';
import { resolveContent } from '@/lib/resolve-content';
import type { ReviewQuality, ReviewState } from '@/types/study';

// ==============================|| SRS REVIEW SESSION ||============================== //

// The deck is a frozen snapshot of the due cards taken at Start, so rating a card (which pushes
// it out of the live `due` query) doesn't reshuffle the session mid-way.

const RATINGS: { quality: ReviewQuality; label: string; className: string }[] = [
  { quality: 'again', label: 'Again', className: 'text-destructive border-destructive/40' },
  { quality: 'hard', label: 'Hard', className: 'text-[color:var(--chart-4)] border-[color:var(--chart-4)]/40' },
  { quality: 'good', label: 'Good', className: 'text-primary border-primary/40' },
  { quality: 'easy', label: 'Easy', className: 'text-[color:var(--chart-2)] border-[color:var(--chart-2)]/40' }
];

export default function ReviewPage() {
  const due = useLiveQuery(() => reviewsRepository.getDue(Date.now()));
  const enrolledCount = useLiveQuery(() => reviewsRepository.count());
  const loading = due === undefined;

  // Flashcards run in the flip-card session below; due problems are practiced on their own
  // pages (deep-linked with ?practice=1), so they render as a separate list on the landing.
  const dueFlashcards = due?.filter((d) => d.id.startsWith('flashcard:'));
  const dueProblems = due?.filter((d) => d.id.startsWith('problem:'));
  const dueCount = dueFlashcards?.length ?? 0;

  const [deck, setDeck] = useState<ReviewState[] | null>(null); // frozen snapshot; null = not started
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const start = useCallback(() => {
    setDeck(dueFlashcards ?? []);
    setPos(0);
    setRevealed(false);
  }, [dueFlashcards]);

  const handleRate = useCallback(
    async (quality: ReviewQuality) => {
      if (!deck) return;
      try {
        const state = await reviewsRepository.get(deck[pos].refId);
        if (state) {
          const next = schedule(state, quality, Date.now());
          await reviewsRepository.upsertAfterReview(next);
          toast.success(`Got it — back ${formatDuePhrase(next.intervalMinutes)}.`);
        }
      } catch {
        toast.error('Could not save your rating.');
      }
      setRevealed(false);
      setPos((p) => p + 1);
    },
    [deck, pos]
  );

  const reset = useCallback(() => {
    setDeck(null);
    setPos(0);
    setRevealed(false);
  }, []);

  // ─── Landing ──────────────────────────────────────────────────────────────
  if (deck === null) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Header />
        {loading ? null : dueCount === 0 ? (
          <CaughtUp enrolledCount={enrolledCount ?? 0} />
        ) : (
          <div className="rounded-xl border border-border bg-card p-10 text-center">
            <IconBrain size={48} className="mx-auto opacity-50" />
            <h2 className="mt-4 text-2xl font-bold">
              {dueCount} {dueCount === 1 ? 'card' : 'cards'} due
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {enrolledCount ?? 0} card{(enrolledCount ?? 0) === 1 ? '' : 's'} in your review deck.
            </p>
            <Button size="lg" onClick={start} className="mt-6">
              Start review
            </Button>
          </div>
        )}
        {(dueProblems?.length ?? 0) > 0 && <DueProblems states={dueProblems ?? []} />}
      </div>
    );
  }

  // ─── Done ─────────────────────────────────────────────────────────────────
  if (pos >= deck.length) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Header />
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <IconChecks size={48} className="mx-auto text-primary opacity-70" />
          <h2 className="mt-4 text-2xl font-bold">Session complete</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            You reviewed {deck.length} {deck.length === 1 ? 'card' : 'cards'}. Nice work.
          </p>
          <Button variant="outline" onClick={reset} className="mt-6">
            Back to review
          </Button>
        </div>
      </div>
    );
  }

  // ─── In session ───────────────────────────────────────────────────────────
  const current = deck[pos];
  const indexed = flashcardByKey.get(current.refId);

  // A card may have been removed from content since enrollment — skip it gracefully.
  if (!indexed) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <Header />
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">This card is no longer available.</p>
          <Button variant="outline" onClick={() => setPos((p) => p + 1)} className="mt-4">
            Skip
          </Button>
        </div>
      </div>
    );
  }

  const progress = (pos / deck.length) * 100;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Header />
      <Progress value={progress} className="mb-2" />
      <p className="text-xs text-muted-foreground">
        Card {pos + 1} of {deck.length}
      </p>

      <FlipCard front={indexed.card.front} back={indexed.card.back} revealed={revealed} onFlip={() => setRevealed((r) => !r)} />

      {!revealed ? (
        <div className="mt-6 flex justify-center">
          <Button size="lg" onClick={() => setRevealed(true)}>
            Show answer
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {RATINGS.map((r) => {
            // Preview uses the same pure scheduler that persists on click.
            const preview = schedule(current, r.quality, Date.now());
            return (
              <Button
                key={r.quality}
                variant="outline"
                size="lg"
                onClick={() => handleRate(r.quality)}
                className={`flex h-auto flex-col gap-0.5 py-2 leading-tight ${r.className}`}
              >
                {r.label}
                <span className="text-xs opacity-80">{formatInterval(preview.intervalMinutes)}</span>
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Pieces ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="mb-6">
      <h1 className="mb-2 text-3xl font-bold">Review</h1>
      <p className="text-muted-foreground">
        Practice the flashcards you&apos;ve added using <strong>spaced repetition</strong> — a proven study method that shows each card
        right before you&apos;d forget it, stretching the gap longer every time you recall it. Rate each card honestly and it schedules
        itself.{' '}
        <a href="https://apps.ankiweb.net/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
          Learn how spaced repetition works
        </a>
        .
      </p>
    </div>
  );
}

// Due coding problems — rated on their own pages, so the live query drops them from this
// list as soon as they're graded.
function DueProblems({ states }: { states: ReviewState[] }) {
  const resolved = states.flatMap((s) => {
    const hit = resolveContent('problem', s.refId);
    return hit?.kind === 'problem' ? [hit] : []; // content removed since enrollment — skip
  });
  if (resolved.length === 0) return null;

  return (
    <div className="mt-6 rounded-xl border border-border bg-card p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <IconCode size={20} className="opacity-70" />
        Coding problems due ({resolved.length})
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Solve each one from scratch — the link opens it in practice mode.</p>
      <ul className="mt-4 divide-y divide-border">
        {resolved.map((r) => (
          <li key={r.refId} className="flex items-center justify-between gap-3 py-2.5">
            <span className="text-sm font-medium">{r.problem.title}</span>
            <span className="flex items-center gap-3">
              <span className="text-xs capitalize text-muted-foreground">{r.problem.difficulty}</span>
              <Button size="sm" variant="outline" nativeButton={false} render={<Link href={`${r.url}?practice=1`}>Practice</Link>} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CaughtUp({ enrolledCount }: { enrolledCount: number }) {
  const description =
    enrolledCount === 0
      ? 'Your review deck is empty. Open a flashcard set and bookmark a card to add it here.'
      : `No cards are due right now. ${enrolledCount} card${enrolledCount === 1 ? '' : 's'} enrolled — check back later.`;

  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
      <h2 className="text-xl font-semibold">All caught up</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {enrolledCount === 0 && (
        <Button variant="outline" className="mt-6" nativeButton={false} render={<a href="/flashcards">Browse flashcards</a>} />
      )}
    </div>
  );
}

// 3D flip card, controlled by the session.
function FlipCard({ front, back, revealed, onFlip }: { front: string; back: string; revealed: boolean; onFlip: () => void }) {
  return (
    <button type="button" onClick={onFlip} className="mt-3 block w-full cursor-pointer outline-none [perspective:1200px]">
      <div
        className="relative h-72 w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: revealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <Face>
          <p className="text-2xl font-bold leading-snug">{front}</p>
          <span className="absolute bottom-4 text-xs text-muted-foreground">Click to flip</span>
        </Face>
        <Face back>
          <p className="text-lg font-medium leading-relaxed">{back}</p>
        </Face>
      </div>
    </button>
  );
}

function Face({ children, back = false }: { children: React.ReactNode; back?: boolean }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-xl border border-border bg-muted/40 p-8 text-center [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
      style={back ? { transform: 'rotateY(180deg)' } : undefined}
    >
      {children}
    </div>
  );
}
