'use client';

import { Plus } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CalendarEvent, CalendarEventInput } from '@/types/planner';
import FullCalendarWrapper from './full-calendar-wrapper';
import UpcomingEvents from './upcoming-events';
import usePlannerEvents from './use-planner-events';

// Drawers only render when their events are opened - lazy-load them so their
// dependencies (react-hook-form, zod, LeafyGreen DatePicker, sheet) only
// download on first open instead of with the planner page.
const EventFormDrawer = dynamic(() => import('./event-form-drawer'), { ssr: false });
const EventDetailDrawer = dynamic(() => import('./event-detail-drawer'), { ssr: false });

// ==============================|| PLANNER - VIEW ||============================== //

export default function PlannerView() {
  const { events, loading, addEvent, editEvent, deleteEvent } = usePlannerEvents();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [formInitial, setFormInitial] = useState<CalendarEvent | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<CalendarEvent | null>(null);

  const handleDateSelect = (start: string, end: string) => {
    setFormMode('add');
    setFormInitial(null);
    setFormOpen(true);
    // Pre-fill dates via a key reset
    setFormInitial({
      id: '',
      title: '',
      start,
      end,
      type: 'study',
      source: 'manual',
      createdAt: 0
    });
    setFormMode('add');
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.source === 'job-tracker') {
      setDetailEvent(event);
      setDetailOpen(true);
      return;
    }
    setDetailEvent(event);
    setDetailOpen(true);
  };

  const handleEditFromDetail = (event: CalendarEvent) => {
    setDetailOpen(false);
    setFormMode('edit');
    setFormInitial(event);
    setFormOpen(true);
  };

  const handleDeleteFromDetail = async (id: string) => {
    await deleteEvent(id);
    setDetailOpen(false);
    setDetailEvent(null);
  };

  const handleFormSubmit = async (values: CalendarEventInput) => {
    if (formMode === 'edit' && formInitial) {
      await editEvent(formInitial.id, values);
    } else {
      await addEvent(values);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Planner</h1>
          <p className="mt-1 text-muted-foreground">Organize your job-search activities and study sessions.</p>
        </div>
        <Button
          onClick={() => {
            setFormMode('add');
            setFormInitial(null);
            setFormOpen(true);
          }}
          className="gap-1.5"
        >
          <Plus className="size-4" /> Add Event
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-4 min-h-0 lg:flex-row">
        <div className="flex-1 min-w-0">
          <FullCalendarWrapper
            events={events}
            onDateSelect={handleDateSelect}
            onEventClick={handleEventClick}
            onEventDrop={editEvent}
            loading={loading}
          />
        </div>
        <div className="w-full shrink-0 lg:w-80">
          <UpcomingEvents events={events} onEventClick={handleEventClick} />
        </div>
      </div>
      {formOpen && (
        <EventFormDrawer
          open={formOpen}
          mode={formMode}
          initialValues={formInitial}
          events={events}
          onClose={() => {
            setFormOpen(false);
            setFormInitial(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}

      {detailOpen && (
        <EventDetailDrawer
          open={detailOpen}
          event={detailEvent}
          onClose={() => {
            setDetailOpen(false);
            setDetailEvent(null);
          }}
          onEdit={handleEditFromDetail}
          onDelete={handleDeleteFromDetail}
        />
      )}
    </div>
  );
}
