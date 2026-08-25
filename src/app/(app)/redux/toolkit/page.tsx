import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { reduxToolkitNotes } from '@/data/redux/redux-toolkit-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'Redux Toolkit | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Redux Toolkit" notes={reduxToolkitNotes} params={await searchParams} />;
}
