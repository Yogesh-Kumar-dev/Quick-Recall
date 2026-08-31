import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { testingFundamentalsNotes } from '@/data/testing/testing-fundamentals-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'Testing Fundamentals | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Testing Fundamentals" notes={testingFundamentalsNotes} params={await searchParams} />;
}
