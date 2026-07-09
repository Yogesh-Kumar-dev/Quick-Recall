import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { nodejsNotes } from '@/data/nodejs/nodejs-notes';

export const metadata = { title: 'Node.js Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Node.js Notes" notes={nodejsNotes} params={await searchParams} />;
}
