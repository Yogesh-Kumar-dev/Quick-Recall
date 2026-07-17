import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { dynamodbNotes } from '@/data/databases/dynamodb-notes';

export const metadata = { title: 'DynamoDB Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="DynamoDB Notes" notes={dynamodbNotes} params={await searchParams} />;
}
