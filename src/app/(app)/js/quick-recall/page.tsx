import QuickRecallView from '@/components/content/quick-recall-view';
import { jsQuickRecall, tsQuickRecall } from '@/data/javascript/js-quick-recall';

export const metadata = { title: 'JS Quick Recall | QuickRecall' };

export default function Page() {
  return (
    <QuickRecallView
      title="⚡ JS & TypeScript Quick Recall"
      intro="Last-minute cheatsheet — scan in 5–10 minutes before your interview. Key concepts, gotchas, and code snippets."
      sections={[...jsQuickRecall, ...tsQuickRecall]}
    />
  );
}
