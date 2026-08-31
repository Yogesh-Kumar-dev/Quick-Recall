import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import FlashcardCarousel from '@/components/flashcards/FlashcardCarousel';
import { FLASHCARD_SETS } from '@/data/flashcard-sets';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export function generateStaticParams() {
  return Object.keys(FLASHCARD_SETS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = FLASHCARD_SETS[section];
  return {
    title: entry ? `${entry.title} | QuickRecall` : 'Flashcards | QuickRecall'
  };
}

export default async function FlashcardsPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = FLASHCARD_SETS[section];

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen space-y-6 py-12">
      <Suspense>
        <FlashcardCarousel cards={entry.cards} source={entry.source} title={entry.title} />
      </Suspense>
    </div>
  );
}
