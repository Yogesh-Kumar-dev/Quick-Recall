import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { engineeringNotes } from '@/data/engineering/engineering-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Engineering Essentials | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Engineering Essentials" notes={engineeringNotes} params={await searchParams} />;
}
