import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { awsNotes } from '@/data/aws/aws-notes';

export const metadata = { title: 'AWS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="AWS" notes={awsNotes} params={await searchParams} />;
}
