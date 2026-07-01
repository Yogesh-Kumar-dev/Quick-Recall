import Link from 'next/link';
import FilterPanel from '@/components/content/filter-panel';
import type { BaseProblemEntry, ProblemDifficulty } from '@/types/content';

const BORDER: Record<ProblemDifficulty, string> = {
  easy: 'border-l-primary',
  medium: 'border-l-[color:var(--chart-4)]',
  hard: 'border-l-destructive'
};

export type ProblemSearchParams = { q?: string; cat?: string; diff?: string };

interface Props {
  title: string;
  problems: BaseProblemEntry[];
  basePath: string; // e.g. '/react/machine-coding'
  params: ProblemSearchParams;
}

export default function ProblemList({ title, problems, basePath, params }: Props) {
  const q = (params.q ?? '').toLowerCase();
  const cat = params.cat ?? 'all';
  const diff = params.diff ?? 'all';

  const shown = problems.filter(
    (p) =>
      (!q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))) &&
      (cat === 'all' || p.category === cat) &&
      (diff === 'all' || p.difficulty === diff)
  );

  const categories = [...new Set(problems.map((p) => p.category))].sort();

  const byCategory: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  for (const p of problems) {
    byCategory[p.category] = (byCategory[p.category] ?? 0) + 1;
    byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] ?? 0) + 1;
  }
  const counts = { total: problems.length, byCategory, byDifficulty };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">{title}</h1>
        <span className="text-sm text-muted-foreground">
          {shown.length} of {problems.length}
        </span>
      </div>

      {/* Grid on the left, sticky filter rail on the right; on mobile the rail becomes a slide-over. */}
      <div className="flex flex-col gap-6 lg:flex-row-reverse">
        <FilterPanel
          categories={categories}
          counts={counts}
          difficulties={['all', 'easy', 'medium', 'hard']}
          searchPlaceholder="Search problems…"
          topicLabel="Category"
        />

        <main className="min-w-0 flex-1">
          {shown.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No problems match your filters.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {shown.map((p) => (
                <Link
                  key={p.id}
                  href={`${basePath}/${p.slug}`}
                  className={`rounded-md border border-border border-l-4 ${BORDER[p.difficulty]} bg-card p-3 transition-colors hover:border-primary/50`}
                >
                  <p className="mb-1 font-medium">{p.title}</p>
                  <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">{p.category}</p>
                  <div className="flex flex-wrap gap-1">
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
