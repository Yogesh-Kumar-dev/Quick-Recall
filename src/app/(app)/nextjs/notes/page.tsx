import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import PdfLauncher from '@/components/pdf-viewer/pdf-launcher';
import { NEXTJS_NOTES_PDFS } from '@/data/pdf-guides';
import { nextjsNotes } from '@/data/nextjs/nextjs-notes';

export const metadata = { title: '▲ Next.js Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return (
    <NotesView
      title="▲ Next.js Notes"
      notes={nextjsNotes}
      params={await searchParams}
      headerAction={<PdfLauncher guides={NEXTJS_NOTES_PDFS} title="Next.js Interview PDF" buttonLabel="Next.js interview PDF" />}
    />
  );
}
