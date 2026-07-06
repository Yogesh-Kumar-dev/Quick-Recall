import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { engineeringNotes } from '@/data/engineering/engineering-notes';

export const metadata = { title: '⚙️ Engineering Essentials | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="⚙️ Engineering Essentials" notes={engineeringNotes} params={await searchParams} />;
}
