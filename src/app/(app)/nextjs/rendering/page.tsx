import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { nextjsRenderingNotes } from '@/data/nextjs/nextjs-rendering';

export const metadata = { title: 'Rendering Strategies | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Rendering Strategies" notes={nextjsRenderingNotes} params={await searchParams} />;
}
