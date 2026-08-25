import QuickRecallView from '@/components/content/quick-recall-view';
import PdfLauncher from '@/components/pdf-viewer/pdf-launcher';
import { jsQuickRecall, tsQuickRecall } from '@/data/javascript/js-quick-recall';
import { JS_QUICK_RECALL_PDFS } from '@/data/pdf-guides';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export const metadata = { title: 'JS Quick Recall | QuickRecall' };

export default function Page() {
  return (
    <QuickRecallView
      title="JS & TypeScript Quick Recall"
      intro="Last-minute cheatsheet — scan in 5–10 minutes before your interview. Key concepts, gotchas, and code snippets."
      sections={[...jsQuickRecall, ...tsQuickRecall]}
      headerAction={<PdfLauncher guides={JS_QUICK_RECALL_PDFS} title="JS Best Practices" buttonLabel="JS best-practices PDFs" />}
    />
  );
}
