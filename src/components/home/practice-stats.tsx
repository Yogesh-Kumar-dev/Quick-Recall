'use client';

import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { IconFlame } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import * as attemptsRepository from '@/db/attempts';
import * as reviewsRepository from '@/db/reviews';

// ==============================|| DASHBOARD — DAILY PRACTICE STATS ||============================== //

// The accountability strip: streak and weekly volume derived from the attempts log at query
// time (never stored), plus the live due count from SRS.

const DAY_MS = 24 * 60 * 60 * 1000;

// Local-midnight day stamp, so a 11pm→7am pair counts as two different days.
function dayStamp(epochMs: number): string {
  return new Date(epochMs).toDateString();
}

// Consecutive days with ≥1 attempt, counting back from today (or yesterday, so the streak
// isn't shown as broken before today's practice).
function currentStreak(attemptDays: Set<string>, now: number): number {
  let streak = 0;
  let day = now;
  if (!attemptDays.has(dayStamp(day))) day -= DAY_MS; // today not practiced yet — anchor on yesterday
  while (attemptDays.has(dayStamp(day))) {
    streak += 1;
    day -= DAY_MS;
  }
  return streak;
}

export default function PracticeStats() {
  // 60 days of history is plenty to derive any streak worth bragging about.
  const attempts = useLiveQuery(() => attemptsRepository.recentAttempts(Date.now() - 60 * DAY_MS));
  const dueCount = useLiveQuery(() => reviewsRepository.countDue(Date.now()));

  if (attempts === undefined) return null;

  const now = Date.now();
  const streak = currentStreak(new Set(attempts.map((a) => dayStamp(a.startedAt))), now);
  const thisWeek = attempts.filter((a) => a.startedAt >= now - 7 * DAY_MS).length;

  const STATS = [
    { label: 'Day streak', value: streak, color: '#ff6d3f' },
    { label: 'Attempts this week', value: thisWeek, color: '#b45af2' },
    { label: 'Due for review', value: dueCount ?? 0, color: '#016bf8' }
  ];

  return (
    <div className="mb-6 rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          <IconFlame size={18} className="text-[#ff6d3f]" />
          Daily practice
        </h2>
        <Button size="sm" variant="outline" nativeButton={false} render={<Link href="/review">Review queue</Link>} />
      </div>
      <div className="flex flex-wrap gap-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="min-w-[120px] flex-1 basis-[140px] rounded-lg border px-4 py-3"
            style={{ backgroundColor: `${s.color}14`, borderColor: `${s.color}38` }}
          >
            <p className="text-3xl leading-tight font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      {attempts.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          No attempts yet — open any machine-coding problem and hit its <strong>Practice</strong> tab to start your streak.
        </p>
      )}
    </div>
  );
}
