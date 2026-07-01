import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { tsReactNotes } from '@/data/javascript/ts-react';

export const metadata = { title: '🟦 TS for React | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="🟦 TS for React" notes={tsReactNotes} params={await searchParams} />;
}
