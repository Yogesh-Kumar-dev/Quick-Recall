'use client';

import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';

import NoteCard from '@/components/content/note-card';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import * as bookmarksRepository from '@/db/bookmarks';
import { resolveContent, type ResolvedContent } from '@/lib/resolve-content';

// ==============================|| SAVED (BOOKMARKS) VIEW ||============================== //

// Lists everything the user has starred, grouped by kind, each linking back to its source.
// Content is resolved from the namespaced refId via `resolveContent`; refIds that no longer
// resolve (content removed since saving, or a not-yet-supported kind) are skipped silently.

export default function BookmarksPage() {
  const bookmarks = useLiveQuery(() => bookmarksRepository.list());
  const loading = bookmarks === undefined;

  // Resolve each bookmark (newest-first order preserved from the repository) and bucket by kind.
  const { notes, flashcards, problems } = useMemo(() => {
    const notesAcc: Extract<ResolvedContent, { kind: 'note' }>[] = [];
    const flashcardsAcc: Extract<ResolvedContent, { kind: 'flashcard' }>[] = [];
    const problemsAcc: Extract<ResolvedContent, { kind: 'problem' }>[] = [];
    for (const b of bookmarks ?? []) {
      const resolved = resolveContent(b.kind, b.refId);
      if (!resolved) continue;
      if (resolved.kind === 'note') notesAcc.push(resolved);
      else if (resolved.kind === 'flashcard') flashcardsAcc.push(resolved);
      else problemsAcc.push(resolved);
    }
    return { notes: notesAcc, flashcards: flashcardsAcc, problems: problemsAcc };
  }, [bookmarks]);

  const total = notes.length + flashcards.length + problems.length;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">Saved</h1>
        <p className="text-muted-foreground">
          Everything you&apos;ve starred for review — problems, notes and flashcards in one place. Saved flashcards are also added to your
          Review deck, where they resurface for practice over time.
        </p>
      </div>

      {loading ? null : total === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
          <h2 className="text-xl font-semibold">Nothing saved yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use the bookmark icon on any note or flashcard to save it here for later review.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {flashcards.length > 0 && (
            <section>
              <SectionHeader title="Flashcards" count={flashcards.length} />
              <div className="space-y-2">
                {flashcards.map((f) => (
                  <div key={f.refId} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{f.card.front}</p>
                      <p className="truncate text-sm text-muted-foreground">{f.card.back}</p>
                    </div>
                    <BookmarkButton kind="flashcard" refId={f.refId} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {problems.length > 0 && (
            <section>
              <SectionHeader title="Problems" count={problems.length} />
              <div className="space-y-2">
                {problems.map((p) => (
                  <div key={p.refId} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                    <Link href={p.url} className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold hover:text-primary">{p.problem.title}</p>
                      <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">{p.problem.category}</p>
                    </Link>
                    <BookmarkButton kind="problem" refId={p.refId} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <SectionHeader title="Notes" count={notes.length} />
              <div className="space-y-2">
                {notes.map((n) => (
                  <NoteCard key={n.refId} note={n.note} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <div className="mb-3 flex items-baseline gap-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <span className="text-sm text-muted-foreground">{count}</span>
    </div>
  );
}
