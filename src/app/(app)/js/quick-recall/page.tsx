import QuickRecallView from '@/components/content/quick-recall-view';
import PdfLauncher from '@/components/pdf-viewer/pdf-launcher';
import { JS_QUICK_RECALL_PDFS } from '@/data/pdf-guides';
import { QUICK_RECALL_SHEETS } from '@/data/quick-recall-registry';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export const metadata = { title: 'JS & TypeScript Quick Recall | QuickRecall' };

export default function Page() {
  const sheet = QUICK_RECALL_SHEETS.javascript;
  return (
    <QuickRecallView
      title={sheet.title}
      intro={sheet.intro}
      sections={sheet.sections}
      headerAction={<PdfLauncher guides={JS_QUICK_RECALL_PDFS} title="JS Best Practices" buttonLabel="JS best-practices PDFs" />}
    />
  );
}
