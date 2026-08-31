import QuickRecallView from '@/components/content/quick-recall-view';
import PdfLauncher from '@/components/pdf-viewer/pdf-launcher';
import { REACT_QUICK_RECALL_PDFS } from '@/data/pdf-guides';
import { QUICK_RECALL_SHEETS } from '@/data/quick-recall-registry';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'React Quick Recall | QuickRecall' };

export default function Page() {
  const sheet = QUICK_RECALL_SHEETS.react;
  return (
    <QuickRecallView
      title={sheet.title}
      intro={sheet.intro}
      sections={sheet.sections}
      headerAction={<PdfLauncher guides={REACT_QUICK_RECALL_PDFS} title="React Interview PDFs" buttonLabel="React interview PDFs" />}
    />
  );
}
