'use client';

import { useCallback, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconBrain, IconChecks } from '@tabler/icons-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import * as reviewsRepository from '@/db/reviews';
import { review as schedule, formatInterval, formatDuePhrase } from '@/lib/review-scheduler';
import { flashcardByKey } from '@/data/flashcards-index';
import type { ReviewQuality, ReviewState } from '@/types/study';

// ==============================|| SRS REVIEW SESSION ||============================== //

// Three states: landing ("N due" → Start), in-session (flip + rate), done ("all caught up").
// The deck is a FROZEN snapshot of the due cards taken at Start, so rating a card (which pushes
// its dueAt into the future and removes it from the live `due` query) doesn't reshuffle the
// session under the user. We keep the full ReviewState so each rating's next interval can be
// PREVIEWED on the buttons, so the user sees when a card resurfaces before choosing.

const RATINGS: { quality: ReviewQuality; label: string; className: string }[] = [
  { quality: 'again', label: 'Again', className: 'text-destructive border-destructive/40' },
  { quality: 'hard', label: 'Hard', className: 'text-[color:var(--chart-4)] border-[color:var(--chart-4)]/40' },
  { quality: 'good', label: 'Good', className: 'text-primary border-primary/40' },
  { quality: 'easy', label: 'Easy', className: 'text-[color:var(--chart-2)] border-[color:var(--chart-2)]/40' }
];

export default function ReviewPage() {
  // Live due list + enrolled count — stay in sync as cards are rated or enrolled (incl. other tabs).
  const due = useLiveQuery(() => reviewsRepository.getDue(Date.now()));
  const enrolledCount = useLiveQuery(() => reviewsRepository.count());
  const loading = due === undefined;
  const dueCount = due?.length ?? 0;

  const [deck, setDeck] = useState<ReviewState[] | null>(null); // frozen snapshot; null = not started
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const start = useCallback(() => {
    setDeck(due ?? []);
    setPos(0);
    setRevealed(false);
  }, [due]);

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
            // Preview where this rating sends the card, using the same pure scheduler that
            // persists on click — so the label shows exactly when the card will come back.
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
