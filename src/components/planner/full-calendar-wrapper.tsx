'use client';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/react/daygrid';
import interactionPlugin from '@fullcalendar/react/interaction';
import timeGridPlugin from '@fullcalendar/react/timegrid';
import { useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { CalendarEvent, CalendarEventInput } from '@/types/planner';
import { EVENT_TYPE_CONFIG } from './config';

import '@fullcalendar/react/skeleton.css';

// ==============================|| FULL CALENDAR WRAPPER ||============================== //

interface FullCalendarWrapperProps {
  events: CalendarEvent[];
  onDateSelect: (start: string, end: string) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventDrop: (id: string, partial: Partial<CalendarEventInput>) => void;
  loading: boolean;
}

function toFullCalendarEvents(events: CalendarEvent[]) {
  return events.map((e) => ({
    id: e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    extendedProps: {
      type: e.type,
      source: e.source,
      description: e.description,
      linkedResource: e.linkedResource
    },
    color: EVENT_TYPE_CONFIG[e.type]?.color,
    contrastColor: '#fff'
  }));
}

function renderEventContent(eventInfo: { timeText: string; event: { title: string; extendedProps: { type?: string } } }) {
  const type = eventInfo.event.extendedProps.type as string | undefined;
  const dotColor = type ? EVENT_TYPE_CONFIG[type as keyof typeof EVENT_TYPE_CONFIG]?.color : '#6b7280';
  return (
    <div className="flex items-center gap-1 px-1 py-0.5 text-xs overflow-hidden">
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: dotColor }} />
      <span className="truncate">{eventInfo.event.title}</span>
    </div>
  );
}

export default function FullCalendarWrapper({ events, onDateSelect, onEventClick, onEventDrop, loading }: FullCalendarWrapperProps) {
  // biome-ignore lint/suspicious/noExplicitAny: FullCalendar ref API type is complex
  const calendarRef = useRef<any>(null);

  const fcEvents = useMemo(() => toFullCalendarEvents(events), [events]);

  const handleDateSelect = (selectInfo: { startStr: string; endStr: string }) => {
    onDateSelect(selectInfo.startStr, selectInfo.endStr);
  };

  const handleEventClick = (clickInfo: {
    event: { id: string; title: string; start: Date | null; end: Date | null; extendedProps: Record<string, unknown> };
  }) => {
    const original = events.find((e) => e.id === clickInfo.event.id);
    if (original) onEventClick(original);
  };

  const handleEventDrop = (dropInfo: {
    event: { id: string; start: Date | null; end: Date | null; extendedProps: Record<string, unknown> };
    revert: () => void;
  }) => {
    const source = dropInfo.event.extendedProps.source as string;
    if (source === 'job-tracker') {
      dropInfo.revert();
      return;
    }
    const start = dropInfo.event.start?.toISOString();
    const end = dropInfo.event.end?.toISOString();
    if (start && end) {
      const conflict = events.some(
        (e) => e.id !== dropInfo.event.id && new Date(start) < new Date(e.end) && new Date(e.start) < new Date(end)
      );
      if (conflict) {
        dropInfo.revert();
        return;
      }
      onEventDrop(dropInfo.event.id, { start, end });
    }
  };

  const handleEventResize = (resizeInfo: {
    event: { id: string; start: Date | null; end: Date | null; extendedProps: Record<string, unknown> };
    revert: () => void;
  }) => {
    const source = resizeInfo.event.extendedProps.source as string;
    if (source === 'job-tracker') {
      resizeInfo.revert();
      return;
    }
    const start = resizeInfo.event.start?.toISOString();
    const end = resizeInfo.event.end?.toISOString();
    if (start && end) {
      const conflict = events.some(
        (e) => e.id !== resizeInfo.event.id && new Date(start) < new Date(e.end) && new Date(e.start) < new Date(end)
      );
      if (conflict) {
        resizeInfo.revert();
        return;
      }
      onEventDrop(resizeInfo.event.id, { start, end });
    }
  };

  if (loading) {
    return <Skeleton className="h-150 w-full rounded-xl" />;
  }

  return (
    <div className="planner-calendar rounded-xl border bg-card p-4">
      <style>{`
        .planner-calendar {
          --fc-classic-border: var(--color-border);
          --fc-classic-background: var(--color-card);
          --fc-classic-muted: var(--color-muted);
          --fc-classic-today: color-mix(in oklab, var(--color-accent) 30%, transparent);
          --fc-classic-highlight: color-mix(in oklab, var(--color-primary) 10%, transparent);
          --fc-classic-faint: color-mix(in oklab, var(--color-muted) 50%, transparent);
          --fc-classic-primary: transparent;
          font-family: inherit;
        }
        .pl-calendar-toolbar {
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          padding-bottom: 1rem !important;
          flex-wrap: wrap !important;
          gap: 0.5rem !important;
        }
        .pl-calendar-toolbar-title {
          font-size: 1.25rem !important;
          font-weight: 600 !important;
          color: var(--color-foreground) !important;
        }
        .pl-calendar-btn {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 0.375rem !important;
          border: 1px solid var(--color-border) !important;
          background-color: var(--color-secondary) !important;
          color: var(--color-secondary-foreground) !important;
          font-size: 0.8125rem !important;
          font-weight: 500 !important;
          padding: 0.375rem 0.75rem !important;
          cursor: pointer !important;
          transition: background-color 0.15s, color 0.15s !important;
          white-space: nowrap !important;
          appearance: none !important;
          text-decoration: none !important;
          line-height: 1.25 !important;
        }
        .pl-calendar-btn:hover {
          background-color: var(--color-accent) !important;
          color: var(--color-accent-foreground) !important;
        }
        .pl-calendar-btn-active,
        .pl-calendar-btn[aria-selected="true"],
        .pl-calendar-btn[aria-pressed="true"] {
          background-color: var(--color-primary) !important;
          border-color: var(--color-primary) !important;
          color: var(--color-primary-foreground) !important;
        }
        .pl-calendar-btn:disabled {
          opacity: 0.5 !important;
          cursor: not-allowed !important;
        }
        .pl-calendar-btn-group {
          display: inline-flex !important;
          gap: 0 !important;
        }
        .pl-calendar-btn-group .pl-calendar-btn {
          border-radius: 0 !important;
        }
        .pl-calendar-btn-group .pl-calendar-btn:first-child {
          border-top-left-radius: 0.375rem !important;
          border-bottom-left-radius: 0.375rem !important;
        }
        .pl-calendar-btn-group .pl-calendar-btn:last-child {
          border-top-right-radius: 0.375rem !important;
          border-bottom-right-radius: 0.375rem !important;
        }
        .pl-calendar-btn-group .pl-calendar-btn + .pl-calendar-btn {
          border-left: none !important;
        }
        .pl-calendar-today-btn {
          margin-left: 0.5rem !important;
        }
        .planner-calendar .fc-event {
          border-radius: 0.25rem;
          cursor: pointer;
        }
        .planner-calendar .fc-timegrid-slot {
          height: 2.5rem;
        }
        .planner-calendar .fc-H0 {
          visibility: visible !important;
        }
      `}</style>
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        toolbarClass="pl-calendar-toolbar"
        toolbarTitleClass="pl-calendar-toolbar-title"
        buttonClass="pl-calendar-btn"
        buttonGroupClass="pl-calendar-btn-group"
        events={fcEvents}
        selectable={true}
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        editable={true}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        height="auto"
        dayMaxEvents={3}
        nowIndicator={true}
        allDaySlot={false}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        weekends={true}
      />
    </div>
  );
}
