'use client';

import { Calendar, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import type { CalendarEvent } from '@/types/planner';
import { EVENT_TYPE_CONFIG } from './config';

// ==============================|| EVENT DETAIL DRAWER ||============================== //

function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

interface EventDetailDrawerProps {
  open: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export default function EventDetailDrawer({ open, event, onClose, onEdit, onDelete }: Readonly<EventDetailDrawerProps>) {
  if (!event) return null;

  const config = EVENT_TYPE_CONFIG[event.type];
  const isJobTracker = event.source === 'job-tracker';

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>Event Details</SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
          <div>
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              {formatEventTime(event.start)}
              {event.end && ` - ${new Date(event.end).toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })}`}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
              style={{ backgroundColor: `${config.color}20`, color: config.color }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: config.color }} />
              {config.label}
            </span>
            {isJobTracker && (
              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                Auto-generated
              </span>
            )}
          </div>

          {event.description && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{event.description}</p>}

          {isJobTracker && event.linkedResource && (
            <a
              href="/job-tracker"
              className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              onClick={onClose}
            >
              <ExternalLink className="size-4" />
              Open in Job Tracker
            </a>
          )}
        </div>

        {!isJobTracker && (
          <div className="flex justify-end gap-3 border-t p-5">
            <Button variant="ghost" size="sm" className="text-destructive gap-1.5" onClick={() => onDelete(event.id)}>
              <Trash2 className="size-4" />
              Delete
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => onEdit(event)}>
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
