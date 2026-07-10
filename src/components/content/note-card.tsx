'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import Link from 'next/link';
import { parseAsString, useQueryState } from 'nuqs';
import type { Note } from '@/types/content';
import type { NoteLink } from '@/data/note-sources';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import CodeBlock from './code-block';

// these chips stay Tailwind; only ExpandableCard / Callout / Code stay LeafyGreen
const DIFFICULTY_BADGE: Record<Note['difficulty'], string> = {
  basic: 'border-primary/40 text-primary',
  intermediate: 'border-[color:var(--chart-4)]/40 text-[color:var(--chart-4)]',
  advanced: 'border-destructive/40 text-destructive'
};

// `!` wins over LeafyGreen's own emotion border
const DIFFICULTY_BORDER: Record<Note['difficulty'], string> = {
  basic: 'border-l-4! border-l-primary!',
  intermediate: 'border-l-4! border-l-[color:var(--chart-4)]!',
  advanced: 'border-l-4! border-l-destructive!'
};

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${className}`}>{children}</span>;
}

export default function NoteCard({ note, prereqs }: { note: Note; prereqs?: NoteLink[] }) {
  const showDeepDive = note.difficulty !== 'basic';

  // shared `open` URL param via nuqs — opening one card closes any other, and makes a note
  // deep-linkable via ?open=<note.id>
  const [openId, setOpenId] = useQueryState('open', parseAsString);
  const isOpen = openId === note.id;
  const handleClick = () => void setOpenId(isOpen ? null : note.id);

  const title = (
    <span className="flex w-full flex-wrap items-center justify-between gap-2">
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-semibold">{note.title}</span>
        <Badge className={`capitalize ${DIFFICULTY_BADGE[note.difficulty]}`}>{note.difficulty}</Badge>
        <Badge className="border-border text-muted-foreground">{note.category}</Badge>
      </span>
      <BookmarkButton kind="note" refId={note.id} stopPropagation />
    </span>
  );

  return (
    <ExpandableCard
      id={`note-${note.id}`}
      isOpen={isOpen}
      onClick={handleClick}
      className={`mb-2 ${DIFFICULTY_BORDER[note.difficulty]}`}
      title={title}
      description={note.summary}
    >
      <div className="space-y-4">
        {prereqs && prereqs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Builds on</span>
            {prereqs.map((p) => (
              <Link
                key={p.id}
                href={p.url}
                onClick={(e) => e.stopPropagation()}
                className="rounded-full border border-border px-2 py-0.5 text-xs text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                {p.title}
              </Link>
            ))}
          </div>
        )}
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Key Points</p>
          <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
            {note.keyPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>

        {showDeepDive && note.textbookDef && (
          <Callout variant={CalloutVariant.Note} title="Textbook Definition">
            {note.textbookDef}
          </Callout>
        )}

        {showDeepDive && note.eli5 && (
          <Callout variant={CalloutVariant.Example} title="Explain Like I'm 5">
            <span className="whitespace-pre-line">{note.eli5}</span>
          </Callout>
        )}

        {note.codeSnippet && <CodeBlock code={note.codeSnippet} />}

        {note.gotcha && (
          <Callout variant={CalloutVariant.Warning} title="Gotcha">
            {note.gotcha}
          </Callout>
        )}
      </div>
    </ExpandableCard>
  );
}
