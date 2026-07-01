import QuickRecallView from '@/components/content/quick-recall-view';
import { reactQuickRecall } from '@/data/react/react-quick-recall';

export const metadata = { title: 'React Quick Recall | QuickRecall' };

export default function Page() {
  return (
    <QuickRecallView
      title="⚡ React Quick Recall"
      intro="Last-minute cheatsheet — scan in 5–10 minutes before your interview. Key concepts, gotchas, and code snippets."
      sections={reactQuickRecall}
    />
  );
}
