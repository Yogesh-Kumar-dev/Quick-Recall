'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { QuickRecallItem, QuickRecallSection } from '@/types/content';
import CodeBlock from './code-block';
import { VirtualizerContext } from './virtual-note-list';
import VirtualizerDebugPanel from './virtualizer-debug-panel';

// above this count, virtualize so hundreds of ExpandableCard instances don't all mount at once
const VIRTUALIZE_THRESHOLD = 50;

function QRItem({ concept, bullets, codeSnippet, warning }: Readonly<QuickRecallItem>) {
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
}: Readonly<{
  title: string;
  intro?: string;
  sections: QuickRecallSection[];
  headerAction?: ReactNode;
}>) {
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

  const OVERSCAN = 4;
  const isVirtualized = sections.length > VIRTUALIZE_THRESHOLD;

  const virtualizer = useWindowVirtualizer({
    count: isVirtualized ? sections.length : 0,
    estimateSize: () => 300,
    overscan: OVERSCAN,
    getItemKey: (index) => sections[index].title,
    enabled: isVirtualized
  });

  const items = isVirtualized ? virtualizer.getVirtualItems() : [];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {/* headerAction crosses the RSC boundary as a prop from the server page; that spuriously
              trips React's dev-only "missing key" warning alongside the Buttons below even though
              there's no real list here — a stable key on this Fragment silences it. */}
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

      {isVirtualized ? (
        <VirtualizerContext.Provider value={virtualizer}>
          <div className="space-y-2">
            <VirtualizerDebugPanel overscan={OVERSCAN} />
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative'
              }}
            >
              {items.map((virtualRow) => (
                <div
                  key={virtualRow.key}
                  data-index={virtualRow.index}
                  ref={virtualizer.measureElement}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`
                  }}
                >
                  {renderSection(sections[virtualRow.index])}
                </div>
              ))}
            </div>
          </div>
        </VirtualizerContext.Provider>
      ) : (
        sections.map(renderSection)
      )}
    </div>
  );
}
