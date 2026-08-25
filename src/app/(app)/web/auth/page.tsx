import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { authNotes } from '@/data/web/auth-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Auth & Identity | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Auth & Identity" notes={authNotes} params={await searchParams} />;
}
