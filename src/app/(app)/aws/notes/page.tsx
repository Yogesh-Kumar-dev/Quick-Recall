import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { awsNotes } from '@/data/aws/aws-notes';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'AWS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="AWS" notes={awsNotes} params={await searchParams} />;
}
