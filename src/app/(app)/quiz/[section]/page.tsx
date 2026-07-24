import { notFound } from 'next/navigation';
import { QUIZ_SETS } from '@/data/quiz-sets';
import QuizRunner from '@/components/quiz/quiz-runner';

export function generateStaticParams() {
  return Object.keys(QUIZ_SETS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = QUIZ_SETS[section];
  return {
    title: entry ? `${entry.title} | QuickRecall` : 'Quiz | QuickRecall'
  };
}

export default async function QuizPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = QUIZ_SETS[section];

  if (!entry) {
    notFound();
  }

  return (
    <div className="min-h-screen space-y-6 py-12">
      <QuizRunner questions={entry.questions} source={entry.source} title={entry.title} />
    </div>
  );
}
