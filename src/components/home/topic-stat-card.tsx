import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

export interface TopicStat {
  label: string;
  value: number | string;
}

export interface TopicQuickLink {
  label: string;
  href: string;
}

interface TopicStatCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor: string;
  stats: TopicStat[];
  difficulty?: { easy: number; medium: number; hard: number };
  quickLinks: TopicQuickLink[];
  primaryHref: string;
  className?: string;
}

const DIFF_COLORS = { easy: '#4caf50', medium: '#ffc107', hard: '#f44336' };

export default function TopicStatCard({
  icon,
  title,
  description,
  accentColor,
  stats,
  difficulty,
  quickLinks,
  primaryHref,
  className
}: TopicStatCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-lg ${className ?? ''}`}
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="mb-3 flex items-center gap-3">
        <div
          className="flex size-[42px] shrink-0 items-center justify-center rounded-[10px] border"
          style={{ color: accentColor, backgroundColor: `${accentColor}1f`, borderColor: `${accentColor}47` }}
        >
          {icon}
        </div>
        <h4 className="font-heading text-lg font-bold">{title}</h4>
      </div>

      <p className={`text-sm leading-relaxed text-muted-foreground ${difficulty ? 'mb-4' : 'mb-5'}`}>{description}</p>

      <div className={`flex gap-3 ${difficulty ? 'mb-4' : 'mb-5'}`}>
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-md border px-3 py-2"
            style={{ backgroundColor: `${accentColor}14`, borderColor: `${accentColor}2e` }}
          >
            <p className="text-2xl leading-tight font-bold" style={{ color: accentColor }}>
              {s.value}
            </p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {difficulty && (
        <div className="mb-4 flex gap-1.5">
          {(['easy', 'medium', 'hard'] as const).map((d) => (
            <span
              key={d}
              className="rounded-full border px-2 py-0.5 text-[11px] capitalize"
              style={{ backgroundColor: `${DIFF_COLORS[d]}1f`, color: DIFF_COLORS[d], borderColor: `${DIFF_COLORS[d]}4d` }}
            >
              {difficulty[d]} {d}
            </span>
          ))}
        </div>
      )}

      <hr className="mb-3 border-border" />

      <div className="mb-4 flex flex-wrap gap-1">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded px-2 py-0.5 text-xs font-medium text-muted-foreground no-underline transition-colors hover:bg-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <Link
        href={primaryHref}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold no-underline transition-colors"
        style={{ color: accentColor, borderColor: `${accentColor}80` }}
      >
        Open {title}
        <IconArrowRight size={16} />
      </Link>
    </div>
  );
}
