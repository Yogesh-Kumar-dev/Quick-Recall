import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { webSecurityNotes } from '@/data/web/web-security-notes';

export const metadata = { title: 'Web Security | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Web Security" notes={webSecurityNotes} params={await searchParams} />;
}
