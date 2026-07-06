import ProblemList, { type ProblemSearchParams } from '@/components/machine-coding/problem-list';
import PlaylistLauncher from '@/components/playlist-player/playlist-launcher';
import { reactMcProblems } from '@/data/react/react-mc-problems';
import { REACT_MACHINE_CODING_PLAYLISTS } from '@/data/video-playlists';

export const metadata = { title: 'React Machine Coding | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<ProblemSearchParams> }) {
  return (
    <ProblemList
      title="⚛️ React Machine Coding"
      problems={reactMcProblems}
      basePath="/react/machine-coding"
      params={await searchParams}
      headerAction={<PlaylistLauncher playlists={REACT_MACHINE_CODING_PLAYLISTS} />}
    />
  );
}
