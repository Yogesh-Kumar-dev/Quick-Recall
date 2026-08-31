import { notFound } from 'next/navigation';
import QuizRunner from '@/components/quiz/quiz-runner';
import { QUIZ_SETS } from '@/data/quiz-sets';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export function generateStaticParams() {
  return Object.keys(QUIZ_SETS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const entry = QUIZ_SETS[section];
  return {
    title: entry ? `${entry.title} | QuickRecall` : 'Quiz | QuickRecall',
    openGraph: { images: ['/icons/icon-maskable-512.png'] }
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
