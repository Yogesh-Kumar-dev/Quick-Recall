import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import { nextjsRenderingNotes } from '@/data/nextjs/nextjs-rendering';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'Rendering Strategies | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Rendering Strategies" notes={nextjsRenderingNotes} params={await searchParams} />;
}
