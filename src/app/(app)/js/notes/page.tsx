import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import InstagramLauncher from '@/components/instagram-launcher/instagram-launcher';
import PlaylistLauncher from '@/components/playlist-player/playlist-launcher';
import { jsNotes } from '@/data/javascript/js-notes';
import { JS_NOTES_INSTAGRAM, JS_NOTES_PLAYLISTS } from '@/data/video-playlists';

export const metadata = { title: 'JS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return (
    <NotesView
      title="JS Notes"
      notes={jsNotes}
      params={await searchParams}
      headerAction={
        <>
          <PlaylistLauncher playlists={JS_NOTES_PLAYLISTS} />
          <InstagramLauncher links={JS_NOTES_INSTAGRAM} />
        </>
      }
    />
  );
}
