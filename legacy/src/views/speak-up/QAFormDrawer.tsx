import { useEffect } from 'react';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// leafygreen (real MongoDB drawer shell + form fields)
import { LGDrawer, LGDrawerDisplayMode, LGTextArea, LGTextAreaState, LGSelect, LGOption } from 'ui-component/leafygreen';

// third party
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// types
import type { JobApplication } from 'types/job-tracker';
import type { SpeakUpQA, SpeakUpQAInput } from 'types/speak-up';

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
  // When set, this is a fresh answer to a predefined question — the question text is
  // fixed (read-only) and carried through as the saved record's `sourceId`.
  sourceId?: string;
  questionLocked?: boolean;
  // Existing tags (predefined categories + user tags) to suggest in the tag field.
  tagOptions: string[];
  jobs: JobApplication[];
  onClose: () => void;
  onSubmit: (values: SpeakUpQAInput) => void | Promise<void>;
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
      // Preserve the link to a predefined question: prefer the existing record's
      // sourceId on edit, fall back to the one passed when answering a predefined card.
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
    // LeafyGreen Drawer (overlay) provides its own title header + close button. We disable its
    // padding/scroll so our flex layout keeps a scrollable body with a pinned footer.
    <LGDrawer
      open={open}
      displayMode={LGDrawerDisplayMode.Overlay}
      title={mode === 'edit' ? 'Edit Answer' : 'Prepare Answer'}
      onClose={onClose}
      hasPadding={false}
      scrollable={false}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Body */}
        <Box component="form" onSubmit={submit} noValidate sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <Stack spacing={2.5} sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
            <LGTextArea
              label="Question"
              placeholder="What question are you preparing for?"
              disabled={questionLocked}
              rows={2}
              state={errors.question ? LGTextAreaState.Error : LGTextAreaState.None}
              errorMessage={errors.question?.message}
              {...register('question')}
            />
            <LGTextArea
              label="Your answer"
              placeholder="Write out the answer you want to practice…"
              rows={6}
              state={errors.answer ? LGTextAreaState.Error : LGTextAreaState.None}
              errorMessage={errors.answer?.message}
              {...register('answer')}
            />
            <Controller
              name="tag"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  freeSolo
                  options={tagOptions}
                  value={field.value ?? ''}
                  onChange={(_, newValue) => field.onChange(newValue ?? '')}
                  onInputChange={(_, newInput) => field.onChange(newInput)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Tag (optional)"
                      placeholder="Pick or type a tag…"
                      helperText="Group this question for the filter chips (e.g. Behavioral, React)."
                      inputRef={field.ref}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="jobId"
              control={control}
              render={({ field }) => (
                <LGSelect
                  label="Linked job (optional)"
                  description="Tie this question to a company from your Job Tracker."
                  placeholder="None"
                  name={field.name}
                  value={field.value ?? ''}
                  onChange={(value) => field.onChange(value)}
                  allowDeselect
                >
                  {jobs.map((job) => (
                    <LGOption key={job.id} value={job.id}>
                      {job.companyName} — {job.jobTitle}
                    </LGOption>
                  ))}
                </LGSelect>
              )}
            />
          </Stack>

          {/* Footer */}
          <Divider />
          <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ p: 2.5 }}>
            <Button color="inherit" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {mode === 'edit' ? 'Save changes' : 'Save answer'}
            </Button>
          </Stack>
        </Box>
      </Box>
    </LGDrawer>
  );
}
