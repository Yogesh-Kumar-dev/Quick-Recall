import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { postgresqlNotes } from '@/data/databases/postgresql-notes';

export const metadata = { title: 'PostgreSQL Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="PostgreSQL Notes" notes={postgresqlNotes} params={await searchParams} />;
}
