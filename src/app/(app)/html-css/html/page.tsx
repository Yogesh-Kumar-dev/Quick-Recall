import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { htmlNotes } from '@/data/htmlcss/html-notes';

export const metadata = { title: 'HTML Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="HTML Notes" notes={htmlNotes} params={await searchParams} />;
}
