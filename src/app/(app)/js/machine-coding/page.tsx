import ProblemList, { type ProblemSearchParams } from '@/components/machine-coding/problem-list';
import PlaylistLauncher from '@/components/playlist-player/playlist-launcher';
import { jsProblems } from '@/data/javascript/js-problems';
import { JS_MACHINE_CODING_PLAYLISTS } from '@/data/video-playlists';

export const metadata = { title: 'JS Machine Coding | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<ProblemSearchParams> }) {
  return (
    <ProblemList
      title="JS Machine Coding"
      problems={jsProblems}
      basePath="/js/machine-coding"
      params={await searchParams}
      headerAction={<PlaylistLauncher playlists={JS_MACHINE_CODING_PLAYLISTS} />}
    />
  );
}
