import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import type { Note } from '@/types/content';
import { etlTestingNotes } from '@/data/testing/etl-testing-notes';
import { pentestNotes } from '@/data/testing/pentest-notes';
import { mobileTestingNotes } from '@/data/testing/mobile-testing-notes';
import { webTestingNotes } from '@/data/testing/web-testing-notes';

export const metadata = { title: 'Specialized Testing | QuickRecall' };

// No category-prefixing needed here (unlike /testing/tools) — ETL/Pentest/Mobile/Web
// each use distinct category names already, so the filter chips stay unambiguous as-is.
const notes: Note[] = [...etlTestingNotes, ...pentestNotes, ...mobileTestingNotes, ...webTestingNotes];

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Specialized Testing" notes={notes} params={await searchParams} />;
}
