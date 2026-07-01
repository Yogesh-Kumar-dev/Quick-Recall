'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import { flashcardKey, type FlashcardSource } from '@/data/flashcards-index';

import type { Flashcard } from '@/types/content';

export default function FlashcardCarousel({
  cards,
  source,
  title
}: {
  cards: Flashcard[];
  source: FlashcardSource;
  title?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="mx-auto max-w-2xl py-12 text-center">
        <p className="text-muted-foreground">No flashcards available for this section.</p>
      </div>
    );
  }

  const current = cards[currentIndex];
  const progress = `${currentIndex + 1} of ${cards.length}`;

  const handlePrev = () => {
    setCurrentIndex((i) => (i === 0 ? cards.length - 1 : i - 1));
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentIndex((i) => (i === cards.length - 1 ? 0 : i + 1));
    setIsFlipped(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === ' ') {
      e.preventDefault();
      setIsFlipped((f) => !f);
    }
  };

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8" aria-label="Flashcard carousel">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{title || 'Flashcards'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{progress}</p>
      </div>

      {/* positioning context: bookmark is a sibling of the flip button (not nested) so we
          keep a single native button as the click/keyboard flip surface. */}
      <div className="relative h-96">
        {/* Bookmark overlay stays fixed above the rotating faces; stopPropagation avoids
            flipping the card. Bookmarking a flashcard enrolls it in Review. */}
        <div className="absolute right-2 top-2 z-10">
          <BookmarkButton kind="flashcard" refId={flashcardKey(source, current.id)} stopPropagation />
        </div>

        {/* ponytail: CSS-based flip animation; no framer-motion dependency */}
        <button
          type="button"
          className="h-full w-full cursor-pointer [perspective:1000px]"
          onClick={() => setIsFlipped((f) => !f)}
          onKeyDown={handleKeyDown}
          aria-label={`Flashcard ${currentIndex + 1}: ${current.front}. Press Space to flip, arrow keys to navigate.`}
        >
          <div
            className="relative h-full w-full transition-transform duration-300 [transform-style:preserve-3d]"
            style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          >
            {/* Front side */}
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-lg border-2 border-border bg-card p-6 [backface-visibility:hidden]"
            >
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Question</p>
                <p className="mt-4 text-lg font-medium">{current.front}</p>
              </div>
            </div>

            {/* Back side */}
            <div
              className="absolute flex h-full w-full items-center justify-center rounded-lg border-2 border-border bg-card p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            >
              <div className="text-center">
                <p className="text-xs font-semibold uppercase text-muted-foreground">Answer</p>
                <p className="mt-4 text-base text-foreground">{current.back}</p>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between gap-4">
        <Button onClick={handlePrev} variant="outline" size="sm" aria-label="Previous card">
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>

        {/* ponytail: dot-per-card only for small decks — flashcard sets run to 500+
            cards, where dots are useless; the "N of M" counter above covers those. */}
        {cards.length <= 20 ? (
          <div className="flex gap-1">
            {cards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(i);
                  setIsFlipped(false);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-border'}`}
                aria-label={`Go to card ${i + 1}`}
              />
            ))}
          </div>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">{progress}</span>
        )}

        <Button
          onClick={handleNext}
          variant="outline"
          size="sm"
          aria-label="Next card"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Click the card to flip • Use arrow keys to navigate • Space to flip
      </p>
    </section>
  );
}
