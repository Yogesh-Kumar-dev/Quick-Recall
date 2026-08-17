// ==============================|| TYPES - PLANNER ||============================== //

export type CalendarEventSource = 'manual' | 'job-tracker';

export type CalendarEventType = 'study' | 'interview' | 'job-search' | 'machine-coding' | 'personal' | 'other';

export type ResourceType = 'job' | 'topic' | 'article' | 'flashcard' | 'machine-coding';

export interface LinkedResource {
  type: ResourceType;
  id: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string; // ISO date-time
  end: string; // ISO date-time
  type: CalendarEventType;
  source: CalendarEventSource;
  linkedResource?: LinkedResource;
  createdAt: number;
}

export type CalendarEventInput = Omit<CalendarEvent, 'id' | 'createdAt'>;
