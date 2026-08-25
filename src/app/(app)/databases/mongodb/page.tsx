import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { mongodbNotes } from '@/data/databases/mongodb-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'MongoDB Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="MongoDB Notes" notes={mongodbNotes} params={await searchParams} />;
}
