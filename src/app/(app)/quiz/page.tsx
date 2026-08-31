import QuizIndexView from '@/components/quiz/quiz-index-view';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = {
  title: 'Quiz | QuickRecall'
};

export default function QuizIndexPage() {
  return <QuizIndexView />;
}
