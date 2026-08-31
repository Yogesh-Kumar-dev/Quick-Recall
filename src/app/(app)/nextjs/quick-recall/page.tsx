import QuickRecallView from '@/components/content/quick-recall-view';
import { QUICK_RECALL_SHEETS } from '@/data/quick-recall-registry';


export const metadata = { title: 'Next.js Quick Recall | QuickRecall' };

export default function Page() {
  const sheet = QUICK_RECALL_SHEETS.nextjs;
  return <QuickRecallView title={sheet.title} intro={sheet.intro} sections={sheet.sections} />;
}
