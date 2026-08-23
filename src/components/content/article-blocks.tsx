'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { HeaderRow, Cell as LGCell, HeaderCell as LGHeaderCell, Row as LGRow, Table, TableBody, TableHead } from '@leafygreen-ui/table';
import type { ComponentType, ReactNode } from 'react';
import type { ArticleBlock } from '@/types/content';
import { splitUrls } from '@/lib/utils';
import ArticleFileTree from './article-file-tree';
import CodeBlock from './code-block';

const CALLOUT_VARIANT_MAP: Record<'note' | 'warning' | 'tip', CalloutVariant> = {
  note: CalloutVariant.Note,
  warning: CalloutVariant.Warning,
  tip: CalloutVariant.Example
};

function TextWithLinks({ text }: Readonly<{ text: string }>) {
  const segments = splitUrls(text);
  return (
    <>
      {segments.map((segment, i) =>
        segment.type === 'url' ? (
          <a
            key={i}
            href={segment.value}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {segment.value}
          </a>
        ) : (
          <span key={i}>{segment.value}</span>
        )
      )}
    </>
  );
}

// LeafyGreen's HeaderCell/Row/Cell types describe the inner forwardRef render-callback signature
// (props, ref) rather than a valid JSX element type — a d.ts gap present even in their own
// documented "Basic" (no useLeafyGreenTable) usage. Cast once here for plain, non-generic use.
const HeaderCell = LGHeaderCell as ComponentType<{ children?: ReactNode }>;
const Row = LGRow as ComponentType<{ children?: ReactNode }>;
const Cell = LGCell as ComponentType<{ children?: ReactNode }>;

export default function ArticleBlocks({ blocks }: Readonly<{ blocks: ArticleBlock[] }>) {
  return (
    <div className="space-y-4">
      {blocks.map((block, i) => {
        // Blocks have no id of their own to key on (headings do, but not every block type) —
        // index is fine here since the array is static per-article, never reordered client-side.
        const key = `${block.type}-${i}`;
        switch (block.type) {
          case 'heading': {
            const Tag = block.level === 2 ? 'h2' : 'h3';
            return (
              <Tag
                key={key}
                id={block.id}
                className={block.level === 2 ? 'scroll-mt-20 text-xl font-semibold' : 'scroll-mt-20 text-lg font-semibold'}
              >
                {block.text}
              </Tag>
            );
          }
          case 'paragraph':
            return (
              <p key={key} className="text-sm leading-relaxed text-muted-foreground">
                {block.text}
              </p>
            );
          case 'code':
            return <CodeBlock key={key} code={block.code} language={block.language} />;
          case 'callout':
            return (
              <Callout key={key} variant={CALLOUT_VARIANT_MAP[block.variant]} title={block.title}>
                <TextWithLinks text={block.text} />
              </Callout>
            );
          case 'list':
            return block.style === 'ordered' ? (
              <ol key={key} className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            ) : (
              <ul key={key} className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case 'steps':
            return (
              <ol key={key} className="space-y-3">
                {block.items.map((step, stepIndex) => (
                  <li key={step.title} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted-foreground">
                      {stepIndex + 1}
                    </span>
                    <span>
                      <span className="font-semibold">{step.title}</span>
                      <span className="text-muted-foreground"> — {step.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            );
          case 'filetree':
            return <ArticleFileTree key={key} root={block.root} nodes={block.nodes} />;
          case 'table':
            return (
              <div key={key} className="overflow-x-auto">
                <Table>
                  <TableHead>
                    <HeaderRow>
                      {block.columns.map((col) => (
                        <HeaderCell key={col}>{col}</HeaderCell>
                      ))}
                    </HeaderRow>
                  </TableHead>
                  <TableBody>
                    {block.rows.map((row) => (
                      <Row key={row.join('|')}>
                        {row.map((value, cellIndex) => (
                          <Cell key={block.columns[cellIndex]}>{value}</Cell>
                        ))}
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
