import QuickRecallView from '@/components/content/quick-recall-view';
import { nodejsQuickRecall } from '@/data/nodejs/nodejs-quick-recall';

export const metadata = { title: 'Node.js Quick Recall | QuickRecall' };

export default function Page() {
  return (
    <QuickRecallView
      title="Node.js Quick Recall"
      intro="Last-minute cheatsheet — scan in 5–10 minutes before your interview. Key concepts, gotchas, and code snippets."
      sections={nodejsQuickRecall}
    />
  );
}
