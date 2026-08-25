import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { rtkQueryNotes } from '@/data/redux/rtk-query-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'RTK Query | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="RTK Query" notes={rtkQueryNotes} params={await searchParams} />;
}
