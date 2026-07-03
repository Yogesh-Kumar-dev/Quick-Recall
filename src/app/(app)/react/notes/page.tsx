import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import InstagramLauncher from '@/components/instagram-launcher/instagram-launcher';
import { reactNotes } from '@/data/react/react-notes';
import { REACT_NOTES_INSTAGRAM } from '@/data/video-playlists';

export const metadata = { title: '⚛️ React Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return (
    <NotesView
      title="⚛️ React Notes"
      notes={reactNotes}
      params={await searchParams}
      headerAction={<InstagramLauncher links={REACT_NOTES_INSTAGRAM} />}
    />
  );
}
