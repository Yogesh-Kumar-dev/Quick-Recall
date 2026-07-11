import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { authNotes } from '@/data/web/auth-notes';

export const metadata = { title: 'Auth & Identity | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Auth & Identity" notes={authNotes} params={await searchParams} />;
}
