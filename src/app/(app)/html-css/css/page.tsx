import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { cssNotes } from '@/data/htmlcss/css-notes';

export const metadata = { title: '🎨 CSS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="🎨 CSS Notes" notes={cssNotes} params={await searchParams} />;
}
