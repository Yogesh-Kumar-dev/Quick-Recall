import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { webPerformanceNotes } from '@/data/web/web-performance-notes';

export const metadata = { title: 'Web Performance | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Web Performance" notes={webPerformanceNotes} params={await searchParams} />;
}
