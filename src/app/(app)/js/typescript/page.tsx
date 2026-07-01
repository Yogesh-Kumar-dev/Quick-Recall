import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { tsNotes } from '@/data/javascript/ts-notes';

export const metadata = { title: '🟦 TS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="🟦 TS Notes" notes={tsNotes} params={await searchParams} />;
}
