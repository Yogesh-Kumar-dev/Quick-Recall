import QuickRecallView from '@/components/content/quick-recall-view';
import { QUICK_RECALL_SHEETS } from '@/data/quick-recall-registry';


export const metadata = { title: 'Engineering Essentials Quick Recall | QuickRecall' };

export default function Page() {
  const sheet = QUICK_RECALL_SHEETS.engineering;
  return <QuickRecallView title={sheet.title} intro={sheet.intro} sections={sheet.sections} />;
}
