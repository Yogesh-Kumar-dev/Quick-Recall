import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { postgresqlNotes } from '@/data/databases/postgresql-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'PostgreSQL Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="PostgreSQL Notes" notes={postgresqlNotes} params={await searchParams} />;
}
