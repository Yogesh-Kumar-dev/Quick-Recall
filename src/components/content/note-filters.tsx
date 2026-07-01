'use client';

import { useQueryState } from 'nuqs';
import { Input } from '@/components/ui/input';

const DIFFICULTIES = ['all', 'basic', 'intermediate', 'advanced'];

export type FilterCounts = { total: number; byCategory: Record<string, number>; byDifficulty: Record<string, number> };

function Chip({ active, label, count, onClick }: { active: boolean; label: string; count?: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'
      }`}
    >
      {label}
      {count != null && <span className="ml-1 opacity-60">{count}</span>}
    </button>
  );
}

// Client island: writes filter state to the URL (nuqs). shallow:false re-runs the Server Component
// so filtering happens on the server — the list itself stays RSC with near-zero client JS.
export default function NoteFilters({ categories, counts }: { categories: string[]; counts: FilterCounts }) {
  const opts = { shallow: false, clearOnDefault: true } as const;
  const [q, setQ] = useQueryState('q', { ...opts, defaultValue: '', throttleMs: 300 });
  const [cat, setCat] = useQueryState('cat', { ...opts, defaultValue: 'all' });
  const [diff, setDiff] = useQueryState('diff', { ...opts, defaultValue: 'all' });

  return (
    <div className="space-y-4">
      <Input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notes…"
        aria-label="Search notes"
        className="w-full"
      />
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Difficulty</p>
        <div className="flex flex-wrap gap-1.5">
          {DIFFICULTIES.map((d) => (
            <Chip
              key={d}
              active={diff === d}
              label={d}
              count={d === 'all' ? counts.total : (counts.byDifficulty[d] ?? 0)}
              onClick={() => setDiff(d)}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Topic</p>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={cat === 'all'} label="all" count={counts.total} onClick={() => setCat('all')} />
          {categories.map((c) => (
            <Chip key={c} active={cat === c} label={c} count={counts.byCategory[c] ?? 0} onClick={() => setCat(c)} />
          ))}
        </div>
      </div>
    </div>
  );
}
