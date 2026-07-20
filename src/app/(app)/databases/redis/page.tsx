import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { redisNotes } from '@/data/databases/redis-notes';

export const metadata = { title: 'Redis Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Redis Notes" notes={redisNotes} params={await searchParams} />;
}
