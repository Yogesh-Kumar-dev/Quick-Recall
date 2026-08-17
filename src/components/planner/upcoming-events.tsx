'use client';

import { Calendar, Clock } from 'lucide-react';
import { useMemo } from 'react';
import type { CalendarEvent } from '@/types/planner';
import { EVENT_TYPE_CONFIG } from './config';

// ==============================|| UPCOMING EVENTS ||============================== //

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' });
}

function formatDateHeader(date: Date): string {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return date.toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

interface UpcomingEventsProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export default function UpcomingEvents({ events, onEventClick }: UpcomingEventsProps) {
  const grouped = useMemo(() => {
    const now = new Date();
    const upcoming = events
      .filter((e) => new Date(e.end) >= now)
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 15);

    const groups: { label: string; events: CalendarEvent[] }[] = [];
    let currentLabel = '';

    for (const event of upcoming) {
      const label = formatDateHeader(new Date(event.start));
      if (label !== currentLabel) {
        currentLabel = label;
        groups.push({ label, events: [] });
      }
      groups[groups.length - 1].events.push(event);
    }

    return groups;
  }, [events]);

  if (grouped.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-sm font-semibold">Upcoming</h3>
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Calendar className="size-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No upcoming events</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">Upcoming</h3>
      <div className="flex flex-col gap-3">
        {grouped.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide">{group.label}</p>
            <div className="flex flex-col gap-1">
              {group.events.map((event) => {
                const config = EVENT_TYPE_CONFIG[event.type];
                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onEventClick(event)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
                  >
                    <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: config.color }} />
                    <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{formatTime(event.start)}</span>
                    <span className="truncate font-medium">{event.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
