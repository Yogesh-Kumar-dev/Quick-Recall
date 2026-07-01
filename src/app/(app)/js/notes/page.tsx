import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { jsNotes } from '@/data/javascript/js-notes';

export const metadata = { title: 'JS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="📗 JS Notes" notes={jsNotes} params={await searchParams} />;
}
