import NotesView, { type NotesSearchParams } from '@/components/content/notes-view';
import PlaylistLauncher from '@/components/playlist-player/playlist-launcher';
import { tsReactNotes } from '@/data/javascript/ts-react';
import { TS_FOR_REACT_PLAYLISTS } from '@/data/video-playlists';

export const metadata = { title: '🟦 TS for React | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<NotesSearchParams> }) {
  return (
    <NotesView
      title="🟦 TS for React"
      notes={tsReactNotes}
      params={await searchParams}
      headerAction={<PlaylistLauncher playlists={TS_FOR_REACT_PLAYLISTS} />}
    />
  );
}
