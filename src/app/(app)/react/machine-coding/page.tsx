import ProblemList, { type ProblemSearchParams } from '@/components/machine-coding/problem-list';
import { reactMcProblems } from '@/data/react/react-mc-problems';

export const metadata = { title: 'React Machine Coding | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<ProblemSearchParams> }) {
  return (
    <ProblemList title="⚛️ React Machine Coding" problems={reactMcProblems} basePath="/react/machine-coding" params={await searchParams} />
  );
}
