import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { reactNotes } from '@/data/react/react-notes';

export const metadata = { title: '⚛️ React Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="⚛️ React Notes" notes={reactNotes} params={await searchParams} />;
}
