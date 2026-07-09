import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { reduxNotes } from '@/data/redux/redux-notes';

export const metadata = { title: 'Redux Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Redux Notes" notes={reduxNotes} params={await searchParams} />;
}
