'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import * as calendarEventsRepository from '@/db/calendar-events';
import * as jobsRepository from '@/db/jobs';
import type { InterviewRound, JobApplication } from '@/types/job-tracker';
import type { CalendarEvent, CalendarEventInput } from '@/types/planner';

function deriveInterviewEvent(job: JobApplication, round: InterviewRound): CalendarEvent {
  const roundTime = new Date(round.at).toISOString();
  const end = new Date(new Date(round.at).getTime() + 60 * 60 * 1000).toISOString();
  return {
    id: `job:${job.id}:${round.id}`,
    title: `${job.companyName} - ${round.name || 'Interview'}`,
    description: `${job.jobTitle} at ${job.companyName}`,
    start: roundTime,
    end,
    type: 'interview',
    source: 'job-tracker',
    linkedResource: { type: 'job', id: job.id },
    createdAt: job.createdAt
  };
}

export function hasOverlap(start: string, end: string, events: CalendarEvent[], excludeId?: string): CalendarEvent | null {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  for (const ev of events) {
    if (excludeId && ev.id === excludeId) continue;
    const evStart = new Date(ev.start).getTime();
    const evEnd = new Date(ev.end).getTime();
    if (s < evEnd && evStart < e) return ev;
  }
  return null;
}

export default function usePlannerEvents() {
  const manualEvents = useLiveQuery(() => calendarEventsRepository.getAll());
  const jobs = useLiveQuery(() => jobsRepository.getAll());

  const interviewEvents = useMemo(() => {
    if (!jobs) return [];
    return jobs.flatMap((job) =>
      job.rounds.filter((round) => round.at && round.outcome === 'pending').map((round) => deriveInterviewEvent(job, round))
    );
  }, [jobs]);

  const events = useMemo(() => [...(manualEvents ?? []), ...interviewEvents], [manualEvents, interviewEvents]);

  const loading = manualEvents === undefined || jobs === undefined;

  const addEvent = useCallback(async (input: CalendarEventInput) => {
    try {
      await calendarEventsRepository.create(input);
      toast.success('Event created.');
    } catch {
      toast.error('Could not create event.');
    }
  }, []);

  const editEvent = useCallback(async (id: string, partial: Partial<CalendarEventInput>) => {
    try {
      await calendarEventsRepository.update(id, partial);
      toast.success('Event updated.');
    } catch {
      toast.error('Could not update event.');
    }
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await calendarEventsRepository.remove(id);
      toast.success('Event deleted.');
    } catch {
      toast.error('Could not delete event.');
    }
  }, []);

  return { events, loading, addEvent, editEvent, deleteEvent };
}
