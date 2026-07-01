import Link from 'next/link';
import type { BaseProblemEntry, ProblemDifficulty } from '@/types/content';

const DIFFICULTIES: { label: string; value: ProblemDifficulty; emoji: string }[] = [
  { label: 'Easy', value: 'easy', emoji: '🟢' },
  { label: 'Medium', value: 'medium', emoji: '🟡' },
  { label: 'Hard', value: 'hard', emoji: '🔴' }
];

const BORDER: Record<ProblemDifficulty, string> = {
  easy: 'border-l-primary',
  medium: 'border-l-[color:var(--chart-4)]',
  hard: 'border-l-destructive'
};

interface Props {
  title: string;
  problems: BaseProblemEntry[];
  basePath: string; // e.g. '/react/machine-coding'
  params: { difficulty?: string };
}

export default function ProblemList({ title, problems, basePath, params }: Props) {
  const active = params.difficulty;
  const shown = active ? problems.filter((p) => p.difficulty === active) : problems;

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-xl font-semibold">{title}</h1>

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href={basePath}
          className={`rounded-full border px-3 py-1 text-sm ${!active ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
        >
          All ({problems.length})
        </Link>
        {DIFFICULTIES.map((d) => {
          const count = problems.filter((p) => p.difficulty === d.value).length;
          const on = active === d.value;
          return (
            <Link
              key={d.value}
              href={`${basePath}?difficulty=${d.value}`}
              className={`rounded-full border px-3 py-1 text-sm ${on ? 'border-primary text-primary' : 'border-border text-muted-foreground'}`}
            >
              {d.emoji} {d.label} ({count})
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
