import Link from 'next/link';
import { IconCards, IconChevronRight } from '@tabler/icons-react';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';

export const metadata = {
  title: 'Flashcards | QuickRecall'
};

// Only list sets that actually have cards (some sources are placeholders for now).
const SETS = Object.entries(FLASHCARD_SETS)
  .map(([slug, set]) => ({ slug, title: set.title, count: set.cards.length }))
  .filter((s) => s.count > 0);

export default function FlashcardsIndexPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Flashcards</h1>
        <p className="text-muted-foreground">
          Quick keyword/definition drills across every topic. Flip a card, and bookmark the ones worth repeating — bookmarked cards are
          added to your <Link href="/review" className="text-primary underline underline-offset-2">Review</Link> deck.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SETS.map((set) => (
          <Link
            key={set.slug}
            href={`/flashcards/${set.slug}`}
            className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted"
          >
            <IconCards size={22} className="shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{set.title}</p>
              <p className="text-xs text-muted-foreground">
                {set.count} {set.count === 1 ? 'card' : 'cards'}
              </p>
            </div>
            <IconChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
