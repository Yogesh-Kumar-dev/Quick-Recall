import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { accessibilityNotes } from '@/data/web/accessibility-notes';

export const metadata = { title: 'Accessibility | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Accessibility" notes={accessibilityNotes} params={await searchParams} />;
}
