import { makeId } from '@/lib/id';
import type { CalendarEvent, CalendarEventInput } from '@/types/planner';
import { db } from './index';

export async function getAll(): Promise<CalendarEvent[]> {
  return db.calendarEvents.orderBy('start').toArray();
}

export async function create(input: CalendarEventInput): Promise<CalendarEvent> {
  const event: CalendarEvent = {
    ...input,
    id: makeId(),
    createdAt: Date.now()
  };
  await db.calendarEvents.add(event);
  return event;
}

export async function update(id: string, partial: Partial<CalendarEventInput>): Promise<CalendarEvent> {
  const existing = await db.calendarEvents.get(id);
  if (!existing) throw new Error('Calendar event not found');
  const updated: CalendarEvent = { ...existing, ...partial, id };
  await db.calendarEvents.put(updated);
  return updated;
}

export async function remove(id: string): Promise<void> {
  await db.calendarEvents.delete(id);
}
