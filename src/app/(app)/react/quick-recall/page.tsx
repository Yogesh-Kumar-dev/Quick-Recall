import QuickRecallView from '@/components/content/quick-recall-view';
import PdfLauncher from '@/components/pdf-viewer/pdf-launcher';
import { REACT_QUICK_RECALL_PDFS } from '@/data/pdf-guides';
import { reactQuickRecall } from '@/data/react/react-quick-recall';

export const metadata = { title: 'React Quick Recall | QuickRecall' };

export default function Page() {
  return (
    <QuickRecallView
      title="⚡ React Quick Recall"
      intro="Last-minute cheatsheet — scan in 5–10 minutes before your interview. Key concepts, gotchas, and code snippets."
      sections={reactQuickRecall}
      headerAction={<PdfLauncher guides={REACT_QUICK_RECALL_PDFS} title="React Interview PDFs" buttonLabel="React interview PDFs" />}
    />
  );
}
