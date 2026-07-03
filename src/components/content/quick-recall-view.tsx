'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import { Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { Button } from '@/components/ui/button';
import type { QuickRecallItem, QuickRecallSection } from '@/types/content';
import CodeBlock from './code-block';

// Below this many sections, a plain list is simpler. Above it, virtualize so hundreds of
// ExpandableCard instances don't all mount at once.
const VIRTUALIZE_THRESHOLD = 50;

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

export default function QuickRecallView({
  title,
  intro,
  sections,
  headerAction
}: {
  title: string;
  intro?: string;
  sections: QuickRecallSection[];
  // Optional slot next to the expand/collapse buttons (e.g. a PdfLauncher for companion PDF guides).
  headerAction?: ReactNode;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>(() => Object.fromEntries(sections.map((s) => [s.title, true])));
  const setAll = (v: boolean) => setOpen(Object.fromEntries(sections.map((s) => [s.title, v])));

  const renderSection = (section: QuickRecallSection) => (
    <ExpandableCard
      key={section.title}
      className="mb-2"
      isOpen={open[section.title]}
      onClick={() => setOpen((m) => ({ ...m, [section.title]: !m[section.title] }))}
      title={section.title}
    >
      <div className="space-y-3">
        {section.items.map((item) => (
          <QRItem key={item.concept} {...item} />
        ))}
      </div>
    </ExpandableCard>
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {/* Keyed wrapper: headerAction is created in the (server) page.tsx and crosses into this
              Client Component as a prop — rendered bare alongside the Buttons below (elements this
              component creates itself), that RSC-boundary crossing spuriously trips React's dev-only
              "missing key" warning even though there's no real list here. A stable key on a Fragment
              wrapper silences it. */}
          <Fragment key="header-action">{headerAction}</Fragment>
          <Button variant="outline" size="sm" onClick={() => setAll(true)}>
            Expand all
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAll(false)}>
            Collapse all
          </Button>
        </div>
      </div>
      {intro && <p className="text-sm text-muted-foreground">{intro}</p>}

      {sections.length > VIRTUALIZE_THRESHOLD ? (
        <Virtuoso
          useWindowScroll
          data={sections}
          computeItemKey={(_, section) => section.title}
          itemContent={(_, section) => renderSection(section)}
        />
      ) : (
        sections.map(renderSection)
      )}
    </div>
  );
}
