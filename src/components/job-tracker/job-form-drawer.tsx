'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { InterviewRound, JobApplication, JobApplicationInput, JobContact, JobDocument, JobNote } from '@/types/job-tracker';
import {
  INTERVIEW_OUTCOME_CONFIG,
  INTERVIEW_OUTCOME_ORDER,
  INTERVIEW_ROUND_NAME_OPTIONS,
  JOB_SOURCE_CONFIG,
  JOB_SOURCE_ORDER,
  JOB_STATUS_CONFIG,
  JOB_STATUS_ORDER,
  WORK_MODE_CONFIG,
  WORK_MODE_ORDER
} from './config';

// ==============================|| JOB TRACKER - FORM DRAWER ||============================== //

const MAX_ROUNDS = 8;

const roundSchema = z.object({
  id: z.string(),
  at: z.string().min(1, 'Date & time is required'),
  name: z.string().optional(),
  outcome: z.enum(['pending', 'passed', 'failed'])
});

const contactSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  role: z.string().optional(),
  email: z
    .string()
    .optional()
    .refine((v) => !v || z.email().safeParse(v).success, 'Enter a valid email'),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^[+\d][\d\s-]{5,}$/.test(v), 'Enter a valid phone number')
});

const documentSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  url: z
    .string()
    .optional()
    .refine((v) => !v || z.url().safeParse(v).success, 'Enter a valid URL')
});

const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || z.url().safeParse(v).success, 'Enter a valid URL');

const optionalNonNegative = z
  .string()
  .optional()
  .refine((v) => !v || (!Number.isNaN(Number(v)) && Number(v) >= 0), 'Enter a valid amount');

const schema = z
  .object({
    companyName: z.string().min(1, 'Company name is required'),
    jobTitle: z.string().min(1, 'Job title is required'),
    status: z.enum(['applied', 'interviewing', 'offer', 'rejected', 'ghosted', 'fake']),
    favorite: z.boolean(),
    jobDescription: z.string().optional(),
    salaryMin: optionalNonNegative,
    salaryMax: optionalNonNegative,
    salaryCurrency: z.string().optional(),
    location: z.string().optional(),
    workMode: z.enum(['remote', 'hybrid', 'onsite', '']).optional(),
    source: z.enum(['linkedin', 'naukri', 'indeed', 'referral', 'company', 'other', '']).optional(),
    sourceUrl: optionalUrl,
    appliedAt: z.string().optional(),
    rounds: z.array(roundSchema),
    contacts: z.array(contactSchema),
    documents: z.array(documentSchema),
    newNote: z.string().optional()
  })
  .superRefine((data, ctx) => {
    if (data.status === 'interviewing' && data.rounds.length === 0) {
      ctx.addIssue({ code: 'custom', path: ['rounds'], message: 'Add at least one interview round' });
    }
    if (data.salaryMin && data.salaryMax && Number(data.salaryMax) < Number(data.salaryMin)) {
      ctx.addIssue({ code: 'custom', path: ['salaryMax'], message: 'Max must be ≥ min' });
    }
    // a round can't be scheduled before the day the application was sent
    if (data.appliedAt) {
      const appliedDayStart = new Date(data.appliedAt);
      appliedDayStart.setHours(0, 0, 0, 0);
      data.rounds.forEach((round, index) => {
        const at = new Date(round.at).getTime();
        if (!Number.isNaN(at) && at < appliedDayStart.getTime()) {
          ctx.addIssue({ code: 'custom', path: ['rounds', index, 'at'], message: 'Cannot be before the applied date' });
        }
      });
    }
    for (let i = 1; i < data.rounds.length; i++) {
      const prev = new Date(data.rounds[i - 1].at).getTime();
      const curr = new Date(data.rounds[i].at).getTime();
      if (!Number.isNaN(prev) && !Number.isNaN(curr) && curr <= prev) {
        ctx.addIssue({ code: 'custom', path: ['rounds', i, 'at'], message: 'Must be after the previous round' });
      }
    }
    // every round but the last must be 'passed': a failed round ends the process, a
    // pending round's outcome is unknown, so neither can be followed by another round
    const chronological = data.rounds
      .map((r, index) => ({ index, time: new Date(r.at).getTime(), outcome: r.outcome }))
      .filter((r) => !Number.isNaN(r.time))
      .sort((a, b) => a.time - b.time);
    chronological.forEach((round, position) => {
      const isLast = position === chronological.length - 1;
      if (isLast || round.outcome === 'passed') return;
      ctx.addIssue({
        code: 'custom',
        path: ['rounds', round.index, 'outcome'],
        message: round.outcome === 'failed' ? 'A failed round must be the last round' : 'Mark this round passed — a later round follows it'
      });
    });
  });

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  companyName: '',
  jobTitle: '',
  status: 'applied',
  favorite: false,
  jobDescription: '',
  salaryMin: '',
  salaryMax: '',
  salaryCurrency: '',
  location: '',
  workMode: '',
  source: '',
  sourceUrl: '',
  appliedAt: '',
  rounds: [],
  contacts: [],
  documents: [],
  newNote: ''
};

interface JobFormDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: JobApplication | null;
  onClose: () => void;
  onSubmit: (values: JobApplicationInput) => void | Promise<void>;
}

// Form state holds date fields as ISO strings; native <input type="date|datetime-local">
// speaks 'YYYY-MM-DD' / 'YYYY-MM-DDTHH:mm'. These helpers bridge the two.
const pad = (n: number) => String(n).padStart(2, '0');
const toDateInput = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const fromDateInput = (v: string) => {
  if (!v) return '';
  const d = new Date(`${v}T00:00:00`);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
};
const toDateTimeLocal = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
const fromDateTimeLocal = (v: string) => {
  if (!v) return '';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
};

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const newRound = (): FormValues['rounds'][number] => ({ id: makeId(), at: '', name: '', outcome: 'pending' });
const newContact = (): FormValues['contacts'][number] => ({ id: makeId(), name: '', role: '', email: '', phone: '' });
const newDocument = (): FormValues['documents'][number] => ({ id: makeId(), label: '', url: '' });

function formatNoteTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Small labelled-field wrapper (label above, optional error below) — cuts repetition
// across the form's ~15 fields.
function Field({
  label,
  htmlFor,
  error,
  className,
  children
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <span className="text-xs text-muted-foreground">{children}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

export default function JobFormDrawer({ open, mode, initialValues, onClose, onSubmit }: JobFormDrawerProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  const rounds = useFieldArray({ control, name: 'rounds' });
  const contacts = useFieldArray({ control, name: 'contacts' });
  const documents = useFieldArray({ control, name: 'documents' });

  const status = watch('status');
  const watchedRounds = watch('rounds');
  const appliedAtValue = watch('appliedAt');

  // A next round can only be added once the latest round has passed. While it's still
  // pending you don't yet know the outcome; if it failed, the process has ended.
  const lastRoundOutcome = watchedRounds && watchedRounds.length > 0 ? watchedRounds[watchedRounds.length - 1].outcome : null;

  const todayInput = toDateInput(new Date().toISOString());

  // Each round must come strictly after the previous one (and not before the applied
  // day). Returns the earliest selectable moment (datetime-local string) for round `index`.
  const roundMin = (index: number): string | undefined => {
    let min: Date | null = null;
    if (appliedAtValue) {
      const d = new Date(appliedAtValue);
      if (!Number.isNaN(d.getTime())) {
        d.setHours(0, 0, 0, 0);
        min = d;
      }
    }
    const prev = index > 0 ? watchedRounds?.[index - 1]?.at : undefined;
    if (prev) {
      const p = new Date(prev);
      if (!Number.isNaN(p.getTime())) {
        const after = new Date(p.getTime() + 60_000);
        if (!min || after > min) min = after;
      }
    }
    return min ? toDateTimeLocal(min.toISOString()) : undefined;
  };

  // Existing notes are read-only history; the form only appends a new one.
  const existingNotes: JobNote[] = mode === 'edit' && initialValues ? (initialValues.notes ?? []) : [];

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialValues) {
      reset({
        companyName: initialValues.companyName,
        jobTitle: initialValues.jobTitle,
        status: initialValues.status,
        favorite: Boolean(initialValues.favorite),
        jobDescription: initialValues.jobDescription ?? '',
        salaryMin: initialValues.salaryMin != null ? String(initialValues.salaryMin) : '',
        salaryMax: initialValues.salaryMax != null ? String(initialValues.salaryMax) : '',
        salaryCurrency: initialValues.salaryCurrency ?? '',
        location: initialValues.location ?? '',
        workMode: initialValues.workMode ?? '',
        source: initialValues.source ?? '',
        sourceUrl: initialValues.sourceUrl ?? '',
        appliedAt: initialValues.appliedAt ?? '',
        rounds: (initialValues.rounds ?? []).map((r) => ({ id: r.id, at: r.at, name: r.name ?? '', outcome: r.outcome })),
        contacts: (initialValues.contacts ?? []).map((c) => ({
          id: c.id,
          name: c.name ?? '',
          role: c.role ?? '',
          email: c.email ?? '',
          phone: c.phone ?? ''
        })),
        documents: (initialValues.documents ?? []).map((d) => ({ id: d.id, label: d.label ?? '', url: d.url ?? '' })),
        newNote: ''
      });
    } else {
      reset(EMPTY);
    }
  }, [open, mode, initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    const cleanRounds: InterviewRound[] = values.rounds.map((r) => ({
      id: r.id,
      at: r.at,
      name: r.name?.trim() || undefined,
      outcome: r.outcome
    }));

    // Drop fully-empty contacts/documents; keep only ones with at least a name / url.
    const cleanContacts: JobContact[] = values.contacts
      .filter((c) => c.name?.trim() || c.email?.trim() || c.phone?.trim())
      .map((c) => ({
        id: c.id,
        name: c.name?.trim() || 'Contact',
        role: c.role?.trim() || undefined,
        email: c.email?.trim() || undefined,
        phone: c.phone?.trim() || undefined
      }));

    const cleanDocuments: JobDocument[] = values.documents
      .filter((d) => d.url?.trim())
      .map((d) => ({ id: d.id, label: d.label?.trim() || 'Document', url: d.url?.trim() as string }));

    // Append the new note (if any) to the existing log.
    const notes: JobNote[] = [...existingNotes];
    if (values.newNote?.trim()) {
      notes.unshift({ id: makeId(), text: values.newNote.trim(), createdAt: Date.now() });
    }

    const payload: JobApplicationInput = {
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      status: values.status,
      favorite: values.favorite || undefined,
      jobDescription: values.jobDescription?.trim() || undefined,
      salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
      salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
      salaryCurrency: values.salaryCurrency?.trim() || undefined,
      location: values.location?.trim() || undefined,
      workMode: values.workMode || undefined,
      source: values.source || undefined,
      sourceUrl: values.sourceUrl?.trim() || undefined,
      appliedAt: values.appliedAt || undefined,
      rounds: cleanRounds,
      contacts: cleanContacts,
      documents: cleanDocuments,
      notes
    };
    await onSubmit(payload);
    onClose();
  });

  const roundsError = typeof errors.rounds?.message === 'string' ? errors.rounds.message : undefined;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-[36rem]">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{mode === 'edit' ? 'Edit Job' : 'Add Job'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-5">
            <div className="flex items-start gap-2">
              <Field label="Company name" htmlFor="companyName" error={errors.companyName?.message} className="flex-1">
                <Input id="companyName" {...register('companyName')} aria-invalid={Boolean(errors.companyName)} />
              </Field>
              <Controller
                name="favorite"
                control={control}
                render={({ field }) => (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn('mt-6', field.value ? 'text-amber-400' : 'text-muted-foreground')}
                    onClick={() => field.onChange(!field.value)}
                    aria-label="toggle favorite"
                  >
                    <Star className={cn('size-5', field.value && 'fill-current')} />
                  </Button>
                )}
              />
            </div>

            <Field label="Job title" htmlFor="jobTitle" error={errors.jobTitle?.message}>
              <Input id="jobTitle" {...register('jobTitle')} aria-invalid={Boolean(errors.jobTitle)} />
            </Field>

            <div className="flex items-start gap-4">
              <Field label="Status" className="flex-1">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_STATUS_ORDER.map((value) => (
                          <SelectItem key={value} value={value}>
                            {JOB_STATUS_CONFIG[value].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Applied on" htmlFor="appliedAt" className="w-[200px] shrink-0">
                <Controller
                  name="appliedAt"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="appliedAt"
                      type="date"
                      max={todayInput}
                      value={toDateInput(field.value)}
                      onChange={(e) => field.onChange(fromDateInput(e.target.value))}
                    />
                  )}
                />
              </Field>
            </div>

            <SectionDivider>Compensation &amp; location</SectionDivider>
            <div className="flex items-start gap-4">
              <Field label="Salary min" htmlFor="salaryMin" error={errors.salaryMin?.message} className="flex-1">
                <Input id="salaryMin" type="number" {...register('salaryMin')} aria-invalid={Boolean(errors.salaryMin)} />
              </Field>
              <Field label="Salary max" htmlFor="salaryMax" error={errors.salaryMax?.message} className="flex-1">
                <Input id="salaryMax" type="number" {...register('salaryMax')} aria-invalid={Boolean(errors.salaryMax)} />
              </Field>
              <Field label="Currency" htmlFor="salaryCurrency" className="max-w-[120px]">
                <Input id="salaryCurrency" placeholder="₹ / $ / USD" {...register('salaryCurrency')} />
              </Field>
            </div>
            <div className="flex items-start gap-4">
              <Field label="Location" htmlFor="location" className="flex-1">
                <Input id="location" placeholder="City or region" {...register('location')} />
              </Field>
              <Field label="Work mode" className="max-w-[180px] flex-1">
                <Controller
                  name="workMode"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">—</SelectItem>
                        {WORK_MODE_ORDER.map((value) => (
                          <SelectItem key={value} value={value}>
                            {WORK_MODE_CONFIG[value].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <div className="flex items-start gap-4">
              <Field label="Source" className="max-w-[180px] flex-1">
                <Controller
                  name="source"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ''} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="—" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">—</SelectItem>
                        {JOB_SOURCE_ORDER.map((value) => (
                          <SelectItem key={value} value={value}>
                            {JOB_SOURCE_CONFIG[value].label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
              <Field label="Source URL" htmlFor="sourceUrl" error={errors.sourceUrl?.message} className="flex-1">
                <Input
                  id="sourceUrl"
                  placeholder="Link to the posting"
                  {...register('sourceUrl')}
                  aria-invalid={Boolean(errors.sourceUrl)}
                />
              </Field>
            </div>

            <Field label="Job description" htmlFor="jobDescription">
              <Textarea id="jobDescription" rows={3} {...register('jobDescription')} />
            </Field>

            <SectionDivider>Interview rounds{status === 'interviewing' ? '' : ' (optional)'}</SectionDivider>
            {rounds.fields.length === 0 && (
              <p className={cn('text-sm', roundsError ? 'text-destructive' : 'text-muted-foreground')}>
                {roundsError ?? 'No rounds yet. Add one for each interview stage.'}
              </p>
            )}
            {rounds.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Round {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => rounds.remove(index)}
                    aria-label={`remove round ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <Field label="Date & time" htmlFor={`rounds.${index}.at`} error={errors.rounds?.[index]?.at?.message}>
                  <Controller
                    name={`rounds.${index}.at` as const}
                    control={control}
                    render={({ field: atField }) => (
                      <Input
                        id={`rounds.${index}.at`}
                        type="datetime-local"
                        min={roundMin(index)}
                        value={toDateTimeLocal(atField.value)}
                        onChange={(e) => atField.onChange(fromDateTimeLocal(e.target.value))}
                        aria-invalid={Boolean(errors.rounds?.[index]?.at)}
                      />
                    )}
                  />
                </Field>
                <Field label="Round name" htmlFor={`rounds.${index}.name`}>
                  <Input
                    id={`rounds.${index}.name`}
                    list="round-name-options"
                    placeholder="Pick or type a round name…"
                    {...register(`rounds.${index}.name` as const)}
                  />
                </Field>
                <Field label="Outcome" error={errors.rounds?.[index]?.outcome?.message}>
                  <Controller
                    name={`rounds.${index}.outcome` as const}
                    control={control}
                    render={({ field: outcomeField }) => (
                      <Select value={outcomeField.value} onValueChange={outcomeField.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {INTERVIEW_OUTCOME_ORDER.map((value) => (
                            <SelectItem key={value} value={value}>
                              {INTERVIEW_OUTCOME_CONFIG[value].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            ))}
            {rounds.fields.length >= MAX_ROUNDS ? (
              <p className="text-xs text-muted-foreground">Maximum of {MAX_ROUNDS} rounds reached.</p>
            ) : lastRoundOutcome === 'failed' ? (
              <p className="text-xs text-muted-foreground">The last round was failed — no further rounds can be added.</p>
            ) : lastRoundOutcome === 'pending' ? (
              <p className="text-xs text-muted-foreground">Mark the last round as passed before adding the next one.</p>
            ) : (
              <Button type="button" variant="outline" size="sm" className="self-start gap-1.5" onClick={() => rounds.append(newRound())}>
                <Plus className="size-4" /> Add round
              </Button>
            )}

            <SectionDivider>Contacts (optional)</SectionDivider>
            {contacts.fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Contact {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive"
                    onClick={() => contacts.remove(index)}
                    aria-label={`remove contact ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <Field label="Name" htmlFor={`contacts.${index}.name`} className="flex-1">
                    <Input id={`contacts.${index}.name`} {...register(`contacts.${index}.name` as const)} />
                  </Field>
                  <Field label="Role" htmlFor={`contacts.${index}.role`} className="flex-1">
                    <Input id={`contacts.${index}.role`} placeholder="Recruiter…" {...register(`contacts.${index}.role` as const)} />
                  </Field>
                </div>
                <Field label="Email" htmlFor={`contacts.${index}.email`} error={errors.contacts?.[index]?.email?.message}>
                  <Input
                    id={`contacts.${index}.email`}
                    {...register(`contacts.${index}.email` as const)}
                    aria-invalid={Boolean(errors.contacts?.[index]?.email)}
                  />
                </Field>
                <Field label="Phone" htmlFor={`contacts.${index}.phone`} error={errors.contacts?.[index]?.phone?.message}>
                  <Input
                    id={`contacts.${index}.phone`}
                    {...register(`contacts.${index}.phone` as const)}
                    aria-invalid={Boolean(errors.contacts?.[index]?.phone)}
                  />
                </Field>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="self-start gap-1.5" onClick={() => contacts.append(newContact())}>
              <Plus className="size-4" /> Add contact
            </Button>

            <SectionDivider>Documents (optional)</SectionDivider>
            {documents.fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <Field label="Label" htmlFor={`documents.${index}.label`} className="max-w-[160px]">
                  <Input id={`documents.${index}.label`} placeholder="Resume v3" {...register(`documents.${index}.label` as const)} />
                </Field>
                <Field label="Link" htmlFor={`documents.${index}.url`} error={errors.documents?.[index]?.url?.message} className="flex-1">
                  <Input
                    id={`documents.${index}.url`}
                    placeholder="https://…"
                    {...register(`documents.${index}.url` as const)}
                    aria-invalid={Boolean(errors.documents?.[index]?.url)}
                  />
                </Field>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="mt-6 text-destructive"
                  onClick={() => documents.remove(index)}
                  aria-label={`remove document ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="self-start gap-1.5"
              onClick={() => documents.append(newDocument())}
            >
              <Plus className="size-4" /> Add document
            </Button>

            <SectionDivider>Notes</SectionDivider>
            <Field label="Add a note" htmlFor="newNote">
              <Textarea id="newNote" rows={2} placeholder="Add to the activity log…" {...register('newNote')} />
            </Field>
            {existingNotes.length > 0 && (
              <div className="flex flex-col gap-2">
                {existingNotes.map((note) => (
                  <div key={note.id} className="rounded-md bg-muted/50 p-3">
                    <div className="text-xs text-muted-foreground">{formatNoteTime(note.createdAt)}</div>
                    <div className="text-sm whitespace-pre-wrap">{note.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 border-t p-5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save changes' : 'Add job'}
            </Button>
          </div>
        </form>

        {/* Shared round-name suggestions for the native combobox above. */}
        <datalist id="round-name-options">
          {INTERVIEW_ROUND_NAME_OPTIONS.map((o) => (
            <option key={o} value={o} />
          ))}
        </datalist>
      </SheetContent>
    </Sheet>
  );
}
