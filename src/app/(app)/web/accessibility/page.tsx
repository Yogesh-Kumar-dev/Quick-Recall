import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { accessibilityNotes } from '@/data/web/accessibility-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'Accessibility | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Accessibility" notes={accessibilityNotes} params={await searchParams} />;
}
