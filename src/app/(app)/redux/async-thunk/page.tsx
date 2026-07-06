import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { asyncThunkNotes } from '@/data/redux/async-thunk-notes';

export const metadata = { title: '🟣 createAsyncThunk | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="🟣 createAsyncThunk" notes={asyncThunkNotes} params={await searchParams} />;
}
