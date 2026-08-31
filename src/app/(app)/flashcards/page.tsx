import FlashcardIndexView from '@/components/flashcards/flashcard-index-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = {
  title: 'Flashcards | QuickRecall'
};

export default function FlashcardsIndexPage() {
  return <FlashcardIndexView />;
}
