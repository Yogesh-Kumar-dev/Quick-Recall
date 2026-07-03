import type { ReactNode } from 'react';
import type { Note } from '@/types/content';
import FilterPanel from './filter-panel';
import NoteCard from './note-card';
import VirtualNoteList from './virtual-note-list';

export type NotesSearchParams = { q?: string; cat?: string; diff?: string };

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
  const q = (params.q ?? '').toLowerCase();
  const cat = params.cat ?? 'all';
  const diff = params.diff ?? 'all';

  const filtered = notes.filter(
    (n) =>
      (!q || n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)) &&
      (cat === 'all' || n.category === cat) &&
      (diff === 'all' || n.difficulty === diff)
  );

  const categories = [...new Set(notes.map((n) => n.category))].sort();

  // Counts across the full set (stable orientation numbers, not affected by the active filter).
  const byCategory: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  for (const n of notes) {
    byCategory[n.category] = (byCategory[n.category] ?? 0) + 1;
    byDifficulty[n.difficulty] = (byDifficulty[n.difficulty] ?? 0) + 1;
  }
  const counts = { total: notes.length, byCategory, byDifficulty };

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
            <VirtualNoteList notes={filtered} />
          ) : (
            <div className="space-y-2">
              {filtered.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
