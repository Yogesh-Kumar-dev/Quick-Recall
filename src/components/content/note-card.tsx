'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import type { Note } from '@/types/content';
import CodeBlock from './code-block';

// difficulty → badge accent (MongoDB palette tokens). These chips were MUI in the original, so they
// stay Tailwind — only the ExpandableCard / Callout / Code stay LeafyGreen.
const DIFFICULTY_BADGE: Record<Note['difficulty'], string> = {
  basic: 'border-primary/40 text-primary',
  intermediate: 'border-[color:var(--chart-4)]/40 text-[color:var(--chart-4)]',
  advanced: 'border-destructive/40 text-destructive'
};

// Difficulty accent on the card's left edge (! wins over LeafyGreen's own emotion border).
const DIFFICULTY_BORDER: Record<Note['difficulty'], string> = {
  basic: 'border-l-4! border-l-primary!',
  intermediate: 'border-l-4! border-l-[color:var(--chart-4)]!',
  advanced: 'border-l-4! border-l-destructive!'
};

function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${className}`}>{children}</span>;
}

export default function NoteCard({ note }: { note: Note }) {
  const showDeepDive = note.difficulty !== 'basic';

  const title = (
    <span className="flex w-full flex-wrap items-center gap-2">
      <span className="font-semibold">{note.title}</span>
      <Badge className={`capitalize ${DIFFICULTY_BADGE[note.difficulty]}`}>{note.difficulty}</Badge>
      <Badge className="border-border text-muted-foreground">{note.category}</Badge>
    </span>
  );

  return (
    <ExpandableCard className={`mb-2 ${DIFFICULTY_BORDER[note.difficulty]}`} title={title} description={note.summary}>
      <div className="space-y-4">
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
