import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { mongodbNotes } from '@/data/databases/mongodb-notes';

export const metadata = { title: 'MongoDB Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="MongoDB Notes" notes={mongodbNotes} params={await searchParams} />;
}
