import { cn } from '@/lib/utils';
import type { JobApplication } from '@/types/job-tracker';
import { deriveStats } from './stats';

// ==============================|| JOB TRACKER - STATS STRIP ||============================== //

function StatTile({ label, value, hint, valueClass }: { label: string; value: string | number; hint?: string; valueClass?: string }) {
  return (
    <div className="min-w-[120px] flex-auto rounded-lg border px-4 py-2.5">
      <div className={cn('text-2xl leading-tight font-semibold', valueClass)}>{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
      {hint && <div className="text-xs text-muted-foreground/70">{hint}</div>}
    </div>
  );
}

export default function StatsStrip({ jobs }: { jobs: JobApplication[] }) {
  const stats = deriveStats(jobs);

  return (
    <div className="flex flex-wrap gap-3">
      <StatTile label="Total" value={stats.total} />
      <StatTile label="Active" value={stats.active} valueClass="text-blue-400" />
      <StatTile label="Upcoming interviews" value={stats.upcoming} valueClass="text-amber-400" />
      <StatTile label="Response rate" value={`${stats.responseRate}%`} valueClass="text-primary" />
      <StatTile label="Offer rate" value={`${stats.offerRate}%`} valueClass="text-emerald-400" />
      <StatTile label="Stale" value={stats.stale} hint="applied, no movement" valueClass={stats.stale > 0 ? 'text-amber-400' : ''} />
    </div>
  );
}
