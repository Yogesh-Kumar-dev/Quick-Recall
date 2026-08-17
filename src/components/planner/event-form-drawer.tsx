'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from '@leafygreen-ui/date-picker';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import type { CalendarEvent, CalendarEventInput } from '@/types/planner';
import { EVENT_TYPE_CONFIG, EVENT_TYPE_ORDER } from './config';
import { hasOverlap } from './use-planner-events';

// ==============================|| EVENT FORM DRAWER ||============================== //

const pad = (n: number) => String(n).padStart(2, '0');

function toUTCDate(iso?: string): Date {
  if (!iso) return new Date();
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function toLocalTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function combineToISO(date: Date, time: string): string {
  const [h, m] = time.split(':').map(Number);
  const dt = new Date(date);
  dt.setHours(h, m, 0, 0);
  return dt.toISOString();
}

const schema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.date(),
    startTime: z.string().min(1, 'Start time is required'),
    endDate: z.date(),
    endTime: z.string().min(1, 'End time is required'),
    type: z.enum(['study', 'interview', 'job-search', 'machine-coding', 'personal', 'other'])
  })
  .refine(
    (data) => {
      const start = combineToISO(data.startDate, data.startTime);
      const end = combineToISO(data.endDate, data.endTime);
      return new Date(end) > new Date(start);
    },
    { message: 'End must be after start', path: ['endTime'] }
  );

type FormValues = z.infer<typeof schema>;

function getDefaultValues(initial?: CalendarEvent | null): FormValues {
  if (initial?.id) {
    return {
      title: initial.title,
      description: initial.description ?? '',
      startDate: toUTCDate(initial.start),
      startTime: toLocalTime(initial.start),
      endDate: toUTCDate(initial.end),
      endTime: toLocalTime(initial.end),
      type: initial.type
    };
  }
  const now = new Date();
  const hourLater = new Date(now.getTime() + 60 * 60 * 1000);
  return {
    title: '',
    description: '',
    startDate: now,
    startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    endDate: hourLater,
    endTime: `${pad(hourLater.getHours())}:${pad(hourLater.getMinutes())}`,
    type: 'study'
  };
}

interface EventFormDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: CalendarEvent | null;
  events: CalendarEvent[];
  onClose: () => void;
  onSubmit: (values: CalendarEventInput) => void | Promise<void>;
}

export default function EventFormDrawer({ open, mode, initialValues, events, onClose, onSubmit }: EventFormDrawerProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: getDefaultValues(initialValues)
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(initialValues));
    }
  }, [open, initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    const start = combineToISO(values.startDate, values.startTime);
    const end = combineToISO(values.endDate, values.endTime);
    const excludeId = mode === 'edit' ? initialValues?.id : undefined;
    const conflict = hasOverlap(start, end, events, excludeId);
    if (conflict) {
      setError('root', { message: `Overlaps with "${conflict.title}". Pick a different time.` });
      return;
    }
    const payload: CalendarEventInput = {
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      start,
      end,
      type: values.type,
      source: 'manual'
    };
    await onSubmit(payload);
    onClose();
  });

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-xl">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{mode === 'edit' ? 'Edit Event' : 'New Event'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register('title')} aria-invalid={Boolean(errors.title)} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" rows={3} {...register('description')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Event type</Label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_TYPE_ORDER.map((t) => (
                        <SelectItem key={t} value={t}>
                          <span className="flex items-center gap-2">
                            <span className="size-2 rounded-full" style={{ backgroundColor: EVENT_TYPE_CONFIG[t].color }} />
                            {EVENT_TYPE_CONFIG[t].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start date"
                      value={field.value}
                      onDateChange={(date) => {
                        if (date && date instanceof Date && !Number.isNaN(date.getTime())) {
                          field.onChange(date);
                        }
                      }}
                      darkMode
                      state={errors.startDate ? 'error' : 'none'}
                      errorMessage={errors.startDate?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="startTime">Start time</Label>
                <Input id="startTime" type="time" {...register('startTime')} aria-invalid={Boolean(errors.startTime)} />
                {errors.startTime && <p className="text-xs text-destructive">{errors.startTime.message}</p>}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="End date"
                      value={field.value}
                      onDateChange={(date) => {
                        if (date && date instanceof Date && !Number.isNaN(date.getTime())) {
                          field.onChange(date);
                        }
                      }}
                      darkMode
                      state={errors.endDate ? 'error' : 'none'}
                      errorMessage={errors.endDate?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor="endTime">End time</Label>
                <Input id="endTime" type="time" {...register('endTime')} aria-invalid={Boolean(errors.endTime)} />
                {errors.endTime && <p className="text-xs text-destructive">{errors.endTime.message}</p>}
              </div>
            </div>

            {errors.root && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errors.root.message}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t p-5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save changes' : 'Create event'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
