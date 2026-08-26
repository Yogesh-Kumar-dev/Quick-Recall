'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import { IconEye, IconEyeOff, IconSearch } from '@tabler/icons-react';
import type { Virtualizer } from '@tanstack/react-virtual';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import type { ReactNode, RefObject } from 'react';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useLocalStorage from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import type { QuickRecallItem, QuickRecallSection } from '@/types/content';
import CodeBlock from './code-block';
import { OVERSCAN, VirtualizerContext } from './virtual-note-list';

// above this count, virtualize so hundreds of ExpandableCard instances don't all mount at once
const VIRTUALIZE_THRESHOLD = 50;
const RECALL_MODE_KEY = 'quick-recall:recall-mode';
// quick-recall sections are taller than note cards (bullets + code + warning), hence the higher estimate
const ESTIMATED_SECTION_HEIGHT = 300;

function QRItem({
  item,
  hidden,
  onReveal
}: Readonly<{
  item: QuickRecallItem;
  hidden: boolean;
  onReveal: () => void;
}>) {
  // In recall mode the answer (bullets/code/warning) is blurred until tapped; the concept
  // title above stays visible and acts as the prompt. Blur + select-none + pointer-events-none
  // so the content can't be read or copied while hidden.
  const answer = (
    <>
      <ul className={cn('list-disc space-y-0.5 pl-5 text-sm text-muted-foreground', hidden && 'pointer-events-none blur-sm')}>
        {item.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {item.codeSnippet && (
        <div className={cn(hidden && 'pointer-events-none blur-sm')}>
          <CodeBlock code={item.codeSnippet} />
        </div>
      )}
      {item.warning && (
        <div className={cn(hidden && 'pointer-events-none blur-sm')}>
          <Callout variant={CalloutVariant.Warning} title="Watch out">
            {item.warning}
          </Callout>
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-medium text-primary">{item.concept}</p>
        {item.href && (
          <a href={item.href} className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline">
            Open note ↗
          </a>
        )}
      </div>
      {/* A plain div with button semantics spread in only while hidden — a real <button> here would
          nest around the copy <button> inside CodeBlock, which is invalid HTML (hydration error). */}
      <div
        {...(hidden
          ? ({
              role: 'button',
              tabIndex: 0,
              'aria-label': `Reveal ${item.concept}`,
              title: 'Tap to reveal',
              onClick: onReveal,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onReveal();
                }
              }
            } as const)
          : {})}
        className={cn('space-y-2', hidden && 'cursor-pointer select-none')}
      >
        {answer}
        {hidden && <p className="text-xs italic text-muted-foreground/70">Tap to reveal</p>}
      </div>
    </div>
  );
}

type RenderSection = (section: QuickRecallSection, index: number) => ReactNode;

// Exposes the mounted virtualizer so the parent's jump-nav can scrollToIndex without prop drilling.
type SectionListProps = {
  sections: QuickRecallSection[];
  sectionKeys: string[];
  renderSection: RenderSection;
  apiRef: RefObject<Virtualizer<Window, Element> | null>;
};

// Mirrors VirtualNoteList (notes pages): the virtualizer hook runs unconditionally because this
// component only mounts once the sheet is known to need virtualization.
function VirtualSectionList({ sections, sectionKeys, renderSection, apiRef }: Readonly<SectionListProps>) {
  const virtualizer = useWindowVirtualizer({
    count: sections.length,
    estimateSize: () => ESTIMATED_SECTION_HEIGHT,
    overscan: OVERSCAN,
    getItemKey: (index) => sectionKeys[index] ?? index
  });

  useEffect(() => {
    apiRef.current = virtualizer;
    return () => {
      apiRef.current = null;
    };
  }, [apiRef, virtualizer]);

  // rAF-deferred measurement (same as VirtualNoteList): measuring synchronously during layout
  // returns stale heights for sections whose code blocks hydrate after mount.
  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        requestAnimationFrame(() => {
          virtualizer.measureElement(node);
        });
      }
    },
    [virtualizer]
  );

  const items = virtualizer.getVirtualItems();

  return (
    <VirtualizerContext.Provider value={virtualizer}>
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
            ref={measureRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`
            }}
          >
            {renderSection(sections[virtualRow.index], virtualRow.index)}
          </div>
        ))}
      </div>
    </VirtualizerContext.Provider>
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
  // open state keyed by section INDEX — merged sheets can repeat section titles across sources
  const [open, setOpen] = useState<Record<number, boolean>>(() => Object.fromEntries(sections.map((_, i) => [i, true])));
  const setAll = (v: boolean) => setOpen(Object.fromEntries(sections.map((_, i) => [i, v])));
  const toggleSection = (index: number) => setOpen((m) => ({ ...m, [index]: !(m[index] ?? true) }));

  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const visibleSections = useMemo(() => {
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((it) => it.concept.toLowerCase().includes(q) || it.bullets.some((b) => b.toLowerCase().includes(q)))
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, q]);

  // merged sheets can repeat section titles across sources — disambiguate keys by occurrence
  const sectionKeys = useMemo(() => {
    const seen = new Map<string, number>();
    return visibleSections.map((s) => {
      const n = seen.get(s.title) ?? 0;
      seen.set(s.title, n + 1);
      return n === 0 ? s.title : `${s.title} (${n + 1})`;
    });
  }, [visibleSections]);

  const [recallMode, setRecallMode] = useLocalStorage<boolean>(RECALL_MODE_KEY, false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const toggleRecallMode = () => {
    setRecallMode((v: boolean) => !v);
    setRevealed(new Set());
  };
  const revealItem = (id: string) => setRevealed((prev) => new Set(prev).add(id));

  // filtering collapses the sheet unpredictably — render it plain while a query is active
  // Heaviness = total items (each renders bullets + code + warning), mirroring how the notes
  // list keys off its card count rather than raw row count.
  const itemCount = useMemo(() => visibleSections.reduce((sum, s) => sum + s.items.length, 0), [visibleSections]);
  const isVirtualized = !q && itemCount > VIRTUALIZE_THRESHOLD;

  // the virtualized list registers its instance here for jump-nav scrolling
  const apiRef = useRef<Virtualizer<Window, Element> | null>(null);

  const scrollToSection = (index: number) => {
    if (isVirtualized && apiRef.current) {
      apiRef.current.scrollToIndex(index, { align: 'start' });
      return;
    }
    document.getElementById(`qr-section-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderSection: RenderSection = (section, index) => (
    <div id={`qr-section-${index}`} key={sectionKeys[index] ?? index}>
      <ExpandableCard className="mb-2 scroll-mt-24" isOpen={open[index] ?? true} onClick={() => toggleSection(index)} title={section.title}>
        <div className="space-y-3">
          {section.items.map((item) => (
            <QRItem
              key={item.id ?? item.concept}
              item={item}
              hidden={recallMode && !revealed.has(item.id ?? item.concept)}
              onReveal={() => revealItem(item.id ?? item.concept)}
            />
          ))}
        </div>
      </ExpandableCard>
    </div>
  );

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {/* headerAction crosses the RSC boundary as a prop from the server page; that spuriously
              trips React's dev-only "missing key" warning alongside the Buttons below even though
              there's no real list here — a stable key on this Fragment silences it. */}
          <Fragment key="header-action">{headerAction}</Fragment>
        </div>
      </div>
      {intro && <p className="text-sm text-muted-foreground">{intro}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <IconSearch size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter concepts..."
            className="h-8 w-52 pl-8 text-sm"
            aria-label="Filter quick-recall items"
          />
        </div>
        <Button variant={recallMode ? 'default' : 'outline'} size="sm" onClick={toggleRecallMode} aria-pressed={recallMode}>
          {recallMode ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          Recall mode
        </Button>
        <span className="grow" />
        <Button variant="outline" size="sm" onClick={() => setAll(true)}>
          Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={() => setAll(false)}>
          Collapse all
        </Button>
      </div>

      {visibleSections.length > 1 && (
        <nav className="flex flex-wrap gap-1" aria-label="Jump to section">
          {visibleSections.map((s, i) => (
            <button
              type="button"
              key={sectionKeys[i]}
              onClick={() => scrollToSection(i)}
              className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
            >
              {s.title}
            </button>
          ))}
        </nav>
      )}

      {isVirtualized ? (
        <VirtualSectionList sections={visibleSections} sectionKeys={sectionKeys} renderSection={renderSection} apiRef={apiRef} />
      ) : (
        <>
          {q && visibleSections.length === 0 && <p className="text-sm text-muted-foreground">No concepts match “{query}”.</p>}
          {visibleSections.map((s, i) => renderSection(s, i))}
        </>
      )}
    </div>
  );
}
