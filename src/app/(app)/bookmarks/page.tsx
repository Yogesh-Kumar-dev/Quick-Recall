'use client';

import { IconLock } from '@tabler/icons-react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { useMemo } from 'react';
import BookmarkButton from '@/components/bookmarks/BookmarkButton';
import NoteCard from '@/components/content/note-card';
import useTopicPreferences from '@/components/settings/use-topic-preferences';
import * as bookmarksRepository from '@/db/bookmarks';
import { type ResolvedContent, resolveContent } from '@/lib/resolve-content';
import { topicForPathname, topicsEnabled } from '@/lib/topic-access';
import type { TopicPreferences } from '@/types/topic-preferences';

function isDisabled(url: string, prefs?: TopicPreferences): boolean {
  if (prefs === undefined) return false;
  const topics = topicForPathname(url.split('?')[0]);
  return topics !== undefined && !topicsEnabled(topics, prefs);
}

// ==============================|| SAVED (BOOKMARKS) VIEW ||============================== //

// refIds that no longer resolve (content removed since saving) are skipped silently.
// Items from a topic the user has switched off stay visible but inactive: they render as a
// locked row with a pointer to Settings instead of their full content.

type DisabledNote = Extract<ResolvedContent, { kind: 'note' }> & { disabled: boolean };
type DisabledFlashcard = Extract<ResolvedContent, { kind: 'flashcard' }> & { disabled: boolean };
type DisabledProblem = Extract<ResolvedContent, { kind: 'problem' }> & { disabled: boolean };

export default function BookmarksPage() {
  const bookmarks = useLiveQuery(() => bookmarksRepository.list());
  const { prefs } = useTopicPreferences();
  const loading = bookmarks === undefined;

  const { notes, flashcards, problems, articles } = useMemo(() => {
    const notesAcc: DisabledNote[] = [];
    const flashcardsAcc: DisabledFlashcard[] = [];
    const problemsAcc: DisabledProblem[] = [];
    const articlesAcc: Extract<ResolvedContent, { kind: 'article' }>[] = [];
    for (const b of bookmarks ?? []) {
      const resolved = resolveContent(b.kind, b.refId);
      if (!resolved) continue;
      if (resolved.kind === 'note') {
        notesAcc.push({ ...resolved, disabled: isDisabled(resolved.url, prefs) });
      } else if (resolved.kind === 'flashcard') {
        flashcardsAcc.push({ ...resolved, disabled: isDisabled(resolved.url, prefs) });
      } else if (resolved.kind === 'problem') {
        problemsAcc.push({ ...resolved, disabled: isDisabled(resolved.url, prefs) });
      } else if (resolved.kind === 'article') {
        articlesAcc.push(resolved);
      }
    }
    return { notes: notesAcc, flashcards: flashcardsAcc, problems: problemsAcc, articles: articlesAcc };
  }, [bookmarks, prefs]);

  const total = notes.length + flashcards.length + problems.length + articles.length;

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
                {flashcards.map((f) =>
                  f.disabled ? (
                    <DisabledRow key={f.refId} title={f.card.front} meta={f.card.back} />
                  ) : (
                    <div key={f.refId} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{f.card.front}</p>
                        <p className="truncate text-sm text-muted-foreground">{f.card.back}</p>
                      </div>
                      <BookmarkButton kind="flashcard" refId={f.refId} />
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {problems.length > 0 && (
            <section>
              <SectionHeader title="Problems" count={problems.length} />
              <div className="space-y-2">
                {problems.map((p) =>
                  p.disabled ? (
                    <DisabledRow key={p.refId} title={p.problem.title} meta={p.problem.category} />
                  ) : (
                    <div key={p.refId} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                      <Link href={p.url} className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold hover:text-primary">{p.problem.title}</p>
                        <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">{p.problem.category}</p>
                      </Link>
                      <BookmarkButton kind="problem" refId={p.refId} />
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <SectionHeader title="Notes" count={notes.length} />
              <div className="space-y-2">
                {notes.map((n) =>
                  n.disabled ? (
                    <DisabledRow key={n.refId} title={n.note.title} meta={n.note.category} />
                  ) : (
                    <NoteCard key={n.refId} note={n.note} />
                  )
                )}
              </div>
            </section>
          )}

          {articles.length > 0 && (
            <section>
              <SectionHeader title="Articles" count={articles.length} />
              <div className="space-y-2">
                {articles.map((a) => (
                  <div key={a.refId} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                    <Link href={a.url} className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold hover:text-primary">{a.article.title}</p>
                      <p className="truncate text-xs uppercase tracking-wide text-muted-foreground">{a.article.topics.join(', ')}</p>
                    </Link>
                    <BookmarkButton kind="article" refId={a.refId} />
                  </div>
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

// Visible-but-inactive row for content from a topic the user has switched off.
function DisabledRow({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2">
      <IconLock size={14} className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-muted-foreground">{title}</p>
        {meta && <p className="truncate text-xs text-muted-foreground">{meta}</p>}
      </div>
      <Link href="/settings" className="shrink-0 text-xs text-primary underline underline-offset-2">
        Manage in Settings
      </Link>
    </div>
  );
}
