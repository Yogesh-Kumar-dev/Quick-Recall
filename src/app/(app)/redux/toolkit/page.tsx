import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { reduxToolkitNotes } from '@/data/redux/redux-toolkit-notes';

export const metadata = { title: '🟣 Redux Toolkit | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="🟣 Redux Toolkit" notes={reduxToolkitNotes} params={await searchParams} />;
}
