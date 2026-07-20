import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import type { Note } from '@/types/content';
import { vitestNotes } from '@/data/testing/vitest-notes';
import { rtlNotes } from '@/data/testing/rtl-notes';
import { jestNotes } from '@/data/testing/jest-notes';
import { mswNotes } from '@/data/testing/msw-notes';
import { supertestNotes } from '@/data/testing/supertest-notes';
import { playwrightNotes } from '@/data/testing/playwright-notes';

export const metadata = { title: 'Testing Frameworks & Tools | QuickRecall' };

// Each source file's `category` is already set to its own tool name (Vitest, RTL, Jest, MSW,
// Supertest, Playwright), so the filter chips here read as per-tool topics with no page-level
// transform — keeps this page and every other consumer of these Note objects (search, bookmarks,
// review, mock interview) showing the same category for the same note.
const notes: Note[] = [...vitestNotes, ...rtlNotes, ...jestNotes, ...mswNotes, ...supertestNotes, ...playwrightNotes];

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return <NotesView title="Testing Frameworks & Tools" notes={notes} params={await searchParams} />;
}
