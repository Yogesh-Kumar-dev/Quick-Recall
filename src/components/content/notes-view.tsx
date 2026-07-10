import Fuse from 'fuse.js';
import type { ReactNode } from 'react';
import type { Note } from '@/types/content';
import { type NoteLink, resolvePrerequisites } from '@/data/note-sources';
import FilterPanel from './filter-panel';
import NoteCard from './note-card';
import ScrollToNote from './scroll-to-note';
import VirtualNoteList from './virtual-note-list';

export type NotesSearchParams = { q?: string; cat?: string; diff?: string; open?: string };

// above this count, virtualize (client-only) so hundreds of ExpandableCards don't all mount at once
const VIRTUALIZE_THRESHOLD = 50;

export default function NotesView({
  title,
  notes,
  params,
  headerAction
}: {
  title: string;
  notes: Note[];
  params: NotesSearchParams;
  headerAction?: ReactNode;
}) {
  const q = params.q ?? '';
  const cat = params.cat ?? 'all';
  const diff = params.diff ?? 'all';

  const textMatched = q.trim()
    ? new Fuse(notes, { keys: ['title', 'summary'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })
        .search(q)
        .map((r) => r.item)
    : notes;
  const filtered = textMatched.filter((n) => (cat === 'all' || n.category === cat) && (diff === 'all' || n.difficulty === diff));

  // chips always list every topic, even ones the current filters zero out, so users can navigate back
  const categories = [...new Set(notes.map((n) => n.category))].sort();

  // faceted counts: each facet reflects the OTHER active facet + text query, not its own
  // selection — so picking "Basic" updates Topic counts to "Basic notes per topic"
  const byCategoryScope = textMatched.filter((n) => diff === 'all' || n.difficulty === diff);
  const byDifficultyScope = textMatched.filter((n) => cat === 'all' || n.category === cat);

  const byCategory: Record<string, number> = {};
  for (const n of byCategoryScope) byCategory[n.category] = (byCategory[n.category] ?? 0) + 1;

  const byDifficulty: Record<string, number> = {};
  for (const n of byDifficultyScope) byDifficulty[n.difficulty] = (byDifficulty[n.difficulty] ?? 0) + 1;

  // resolved server-side so client components never import the full cross-topic notes arrays
  const prereqLinks: Record<string, NoteLink[]> = {};
  for (const n of filtered) {
    const links = resolvePrerequisites(n);
    if (links.length > 0) prereqLinks[n.id] = links;
  }

  const counts = {
    categoryTotal: byCategoryScope.length,
    difficultyTotal: byDifficultyScope.length,
    byCategory,
    byDifficulty
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {headerAction}
          <span className="text-sm text-muted-foreground">
            {filtered.length} of {notes.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        <FilterPanel categories={categories} counts={counts} />

        <main className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No notes match your filters.</p>
          ) : filtered.length > VIRTUALIZE_THRESHOLD ? (
            <VirtualNoteList notes={filtered} openId={params.open} prereqLinks={prereqLinks} />
          ) : (
            <div className="space-y-2">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} prereqs={prereqLinks[note.id]} />
              ))}
            </div>
          )}
          <ScrollToNote id={params.open} />
        </main>
      </div>
    </div>
  );
}
