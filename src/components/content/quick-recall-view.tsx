'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import type { QuickRecallItem, QuickRecallSection } from '@/types/content';
import CodeBlock from './code-block';

function QRItem({ concept, bullets, codeSnippet, warning }: QuickRecallItem) {
  return (
    <div className="space-y-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <p className="font-medium text-primary">{concept}</p>
      <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {codeSnippet && <CodeBlock code={codeSnippet} />}
      {warning && (
        <Callout variant={CalloutVariant.Warning} title="Watch out">
          {warning}
        </Callout>
      )}
    </div>
  );
}

export default function QuickRecallView({ title, intro, sections }: { title: string; intro?: string; sections: QuickRecallSection[] }) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <h1 className="font-heading text-2xl font-bold">{title}</h1>
      {intro && <p className="text-sm text-muted-foreground">{intro}</p>}

      {sections.map((section) => (
        <ExpandableCard key={section.title} className="mb-2" defaultOpen title={section.title}>
          <div className="space-y-3">
            {section.items.map((item) => (
              <QRItem key={item.concept} {...item} />
            ))}
          </div>
        </ExpandableCard>
      ))}
    </div>
  );
}
