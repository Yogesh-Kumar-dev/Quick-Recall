import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import InstagramLauncher from '@/components/instagram-launcher/instagram-launcher';
import PlaylistLauncher from '@/components/playlist-player/playlist-launcher';
import { tsNotes } from '@/data/javascript/ts-notes';
import { TS_NOTES_INSTAGRAM, TS_NOTES_PLAYLISTS } from '@/data/video-playlists';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'TS Notes | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return (
    <NotesView
      title="TS Notes"
      notes={tsNotes}
      params={await searchParams}
      headerAction={
        <>
          <PlaylistLauncher playlists={TS_NOTES_PLAYLISTS} />
          <InstagramLauncher links={TS_NOTES_INSTAGRAM} />
        </>
      }
    />
  );
}
