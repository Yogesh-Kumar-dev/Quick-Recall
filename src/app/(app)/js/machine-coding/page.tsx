import ProblemList from '@/components/machine-coding/problem-list';
import { jsProblems } from '@/data/javascript/js-problems';

export const metadata = { title: 'JS Machine Coding | QuickRecall' };

export default async function Page({ searchParams }: { searchParams: Promise<{ difficulty?: string }> }) {
  return <ProblemList title="⚙️ JS Machine Coding" problems={jsProblems} basePath="/js/machine-coding" params={await searchParams} />;
}
