import Fuse from 'fuse.js';
import type { ReactNode } from 'react';
import type { Note } from '@/types/content';
import FilterPanel from './filter-panel';
import NoteCard from './note-card';
import ScrollToNote from './scroll-to-note';
import VirtualNoteList from './virtual-note-list';

export type NotesSearchParams = { q?: string; cat?: string; diff?: string; open?: string };

// Below this many filtered notes, a plain server-rendered list is both simpler and keeps content
// in the initial HTML. Above it, virtualize (client-only render) so hundreds of ExpandableCard
// instances don't all mount at once.
const VIRTUALIZE_THRESHOLD = 50;

// Shared Server Component for every notes route. Filters `notes` from the URL params (server-side)
// and renders the list + the client filter island.
export default function NotesView({
  title,
  notes,
  params,
  headerAction
}: {
  title: string;
  notes: Note[];
  params: NotesSearchParams;
  // Optional slot next to the title (e.g. a PdfLauncher on pages with companion PDF guides).
  headerAction?: ReactNode;
}) {
  const q = params.q ?? '';
  const cat = params.cat ?? 'all';
  const diff = params.diff ?? 'all';

  // Fuzzy title/summary match (fuse.js, ranked) when a query is present, otherwise the full set
  // in natural order — then the exact category/difficulty filters narrow it further.
  const textMatched = q.trim()
    ? new Fuse(notes, { keys: ['title', 'summary'], threshold: 0.4, ignoreLocation: true, minMatchCharLength: 2 })
        .search(q)
        .map((r) => r.item)
    : notes;
  const filtered = textMatched.filter((n) => (cat === 'all' || n.category === cat) && (diff === 'all' || n.difficulty === diff));

  // Chip labels always list every topic (even ones the current filters zero out) so users can
  // still navigate back to them — only the counts next to each chip are cross-filtered.
  const categories = [...new Set(notes.map((n) => n.category))].sort();

  // Cross-filtered (faceted) counts: each facet's numbers reflect the OTHER active facet + the
  // text query, but ignore its own current selection — so picking "Basic" updates the Topic
  // counts to "how many Basic notes per topic", while every topic chip (including the selected
  // one) stays visible with an accurate, live count instead of a frozen global total.
  const byCategoryScope = textMatched.filter((n) => diff === 'all' || n.difficulty === diff);
  const byDifficultyScope = textMatched.filter((n) => cat === 'all' || n.category === cat);

  const byCategory: Record<string, number> = {};
  for (const n of byCategoryScope) byCategory[n.category] = (byCategory[n.category] ?? 0) + 1;

  const byDifficulty: Record<string, number> = {};
  for (const n of byDifficultyScope) byDifficulty[n.difficulty] = (byDifficulty[n.difficulty] ?? 0) + 1;

  const counts = {
    categoryTotal: byCategoryScope.length, // "all" topic chip: matches under the current difficulty + query
    difficultyTotal: byDifficultyScope.length, // "all" difficulty chip: matches under the current topic + query
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

      {/* List on the left, sticky filter rail on the right; on mobile the rail becomes a slide-over. */}
      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        <FilterPanel categories={categories} counts={counts} />

        <main className="min-w-0 flex-1">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No notes match your filters.</p>
          ) : filtered.length > VIRTUALIZE_THRESHOLD ? (
            <VirtualNoteList notes={filtered} openId={params.open} />
          ) : (
            <div className="space-y-2">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
          <ScrollToNote id={params.open} />
        </main>
      </div>
    </div>
  );
}
