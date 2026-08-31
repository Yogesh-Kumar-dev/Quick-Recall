import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { htmlNotes } from '@/data/htmlcss/html-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'HTML Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="HTML Notes" notes={htmlNotes} params={await searchParams} />;
}
