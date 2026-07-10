'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { JobApplication } from '@/types/job-tracker';
import type { SpeakUpQA, SpeakUpQAInput } from '@/types/speak-up';

// ==============================|| SPEAK UP - Q&A FORM DRAWER ||============================== //

const schema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  tag: z.string().optional(),
  jobId: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = { question: '', answer: '', tag: '', jobId: '' };

interface QAFormDrawerProps {
  open: boolean;
  mode: 'add' | 'edit';
  initialValues?: SpeakUpQA | null;
  // set when this is a fresh answer to a predefined question; carried through as the record's sourceId
  sourceId?: string;
  questionLocked?: boolean;
  tagOptions: string[];
  jobs: JobApplication[];
  onClose: () => void;
  onSubmit: (values: SpeakUpQAInput) => void | Promise<void>;
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  children
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default function QAFormDrawer({
  open,
  mode,
  initialValues,
  sourceId,
  questionLocked,
  tagOptions,
  jobs,
  onClose,
  onSubmit
}: QAFormDrawerProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (!open) return;
    if (initialValues) {
      reset({
        question: initialValues.question,
        answer: initialValues.answer,
        tag: initialValues.tag ?? '',
        jobId: initialValues.jobId ?? ''
      });
    } else {
      reset(EMPTY);
    }
  }, [open, initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    const payload: SpeakUpQAInput = {
      sourceId: initialValues?.sourceId ?? sourceId,
      question: values.question.trim(),
      answer: values.answer.trim(),
      tag: values.tag?.trim() || undefined,
      jobId: values.jobId || undefined
    };
    await onSubmit(payload);
    onClose();
  });

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full gap-0 p-0 data-[side=right]:sm:max-w-[30rem]">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{mode === 'edit' ? 'Edit Answer' : 'Prepare Answer'}</SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
            <Field label="Question" htmlFor="question" error={errors.question?.message}>
              <Textarea
                id="question"
                rows={2}
                placeholder="What question are you preparing for?"
                disabled={questionLocked}
                className={cn(questionLocked && 'opacity-70')}
                aria-invalid={Boolean(errors.question)}
                {...register('question')}
              />
            </Field>

            <Field label="Your answer" htmlFor="answer" error={errors.answer?.message}>
              <Textarea
                id="answer"
                rows={6}
                placeholder="Write out the answer you want to practice…"
                aria-invalid={Boolean(errors.answer)}
                {...register('answer')}
              />
            </Field>

            <Field label="Tag (optional)" htmlFor="tag" hint="Group this question for the filter chips (e.g. Behavioral, React).">
              <Input id="tag" list="speak-up-tag-options" placeholder="Pick or type a tag…" {...register('tag')} />
              <datalist id="speak-up-tag-options">
                {tagOptions.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </Field>

            <Field label="Linked job (optional)" hint="Tie this question to a company from your Job Tracker.">
              <Controller
                name="jobId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ''} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id}>
                          {job.companyName} — {job.jobTitle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t p-5">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save changes' : 'Save answer'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
