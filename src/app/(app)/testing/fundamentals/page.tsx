import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { testingFundamentalsNotes } from '@/data/testing/testing-fundamentals-notes';

export const metadata = { title: 'Testing Fundamentals | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Testing Fundamentals" notes={testingFundamentalsNotes} params={await searchParams} />;
}
