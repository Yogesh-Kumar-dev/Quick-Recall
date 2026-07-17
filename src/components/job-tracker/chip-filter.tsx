import { cn } from '@/lib/utils';

// A small toggleable filter/selection chip — optionally shows a count (e.g. "12 Applied").
// Originated here for Job Tracker's status filters; also reused by Mock Interview's topic/type selectors.

export function ChipFilter({
  active,
  count,
  label,
  colorClass,
  onClick
}: {
  active: boolean;
  count?: number;
  label: string;
  colorClass?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : cn('hover:bg-accent', colorClass)
      )}
    >
      {count !== undefined && <span className="font-bold">{count}</span>} {label}
    </button>
  );
}
