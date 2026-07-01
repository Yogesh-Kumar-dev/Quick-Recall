import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { nextjsNotes } from '@/data/nextjs/nextjs-notes';

export const metadata = { title: '▲ Next.js Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="▲ Next.js Notes" notes={nextjsNotes} params={await searchParams} />;
}
