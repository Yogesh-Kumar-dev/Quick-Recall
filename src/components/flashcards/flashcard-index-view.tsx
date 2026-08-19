'use client';

import { IconCards, IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import ShareButton from '@/components/content/ShareButton';
import useTopicPreferences from '@/components/settings/use-topic-preferences';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';
import { flashcardSlugTopics, topicsEnabled } from '@/lib/topic-access';

// ==============================|| FLASHCARDS - INDEX VIEW ||============================== //

// Hides sets whose topic the user has switched off in Settings (the section routes themselves
// are route-guarded separately).

export default function FlashcardIndexView() {
  const { prefs } = useTopicPreferences();

  const sets = useMemo(() => {
    const all = Object.entries(FLASHCARD_SETS)
      .map(([slug, set]) => ({ slug, title: set.title, count: set.cards.length }))
      .filter((s) => s.count > 0);
    if (!prefs) return all;
    return all.filter((s) => {
      const topics = flashcardSlugTopics[s.slug];
      return !topics || topicsEnabled(topics, prefs);
    });
  }, [prefs]);

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Flashcards</h1>
        <p className="text-muted-foreground">
          Quick keyword/definition drills across every topic. Flip a card, and bookmark the ones worth repeating — bookmarked cards are
          added to your{' '}
          <Link href="/review" className="text-primary underline underline-offset-2">
            Review
          </Link>{' '}
          deck.
        </p>
      </div>

      {sets.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="text-xl font-semibold">No flashcards available</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            All flashcard topics are currently switched off. Turn some back on in{' '}
            <Link href="/settings" className="text-primary underline underline-offset-2">
              Settings
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {sets.map((set) => (
            <div
              key={set.slug}
              className="group flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/50 hover:bg-muted"
            >
              <Link href={`/flashcards/${set.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
                <IconCards size={22} className="shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{set.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {set.count} {set.count === 1 ? 'card' : 'cards'}
                  </p>
                </div>
                <IconChevronRight size={18} className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
              <ShareButton
                title={`${set.title} flashcards`}
                text={`Practice ${set.title} flashcards on QuickRecall.`}
                path={`/flashcards/${set.slug}`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
