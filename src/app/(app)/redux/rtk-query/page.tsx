import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { rtkQueryNotes } from '@/data/redux/rtk-query-notes';

export const metadata = { title: 'RTK Query | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="RTK Query" notes={rtkQueryNotes} params={await searchParams} />;
}
