import { useEffect } from 'react';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { IconPlus, IconStar, IconStarFilled, IconTrash } from '@tabler/icons-react';

// leafygreen (real MongoDB drawer shell + form fields). Date pickers + the freeSolo "round name"
// Autocomplete stay on MUI: LeafyGreen's DatePicker has a more limited constraint API (no dayjs /
// disableFuture / minDateTime cross-field rules) and Combobox handles freeSolo creation awkwardly.
import {
  LGDrawer,
  LGDrawerDisplayMode,
  LGDrawerSize,
  LGDrawerClassName,
  LGTextInput,
  LGTextInputState,
  LGTextArea,
  LGSelect,
  LGOption,
  LGSelectState,
  LGLabel
} from 'ui-component/leafygreen';

// third party
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';

// project imports
import { JOB_STATUS_CONFIG, JOB_STATUS_ORDER } from './statusConfig';
import { INTERVIEW_OUTCOME_CONFIG, INTERVIEW_OUTCOME_ORDER, INTERVIEW_ROUND_NAME_OPTIONS } from './roundConfig';
import { JOB_SOURCE_CONFIG, JOB_SOURCE_ORDER, WORK_MODE_CONFIG, WORK_MODE_ORDER } from './jobConfig';

// types
import type { InterviewRound, JobApplication, JobApplicationInput, JobContact, JobDocument, JobNote } from 'types/job-tracker';

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
    .refine((v) => !v || z.string().email().safeParse(v).success, 'Enter a valid email'),
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
    .refine((v) => !v || z.string().url().safeParse(v).success, 'Enter a valid URL')
});

const optionalUrl = z
  .string()
  .optional()
  .refine((v) => !v || z.string().url().safeParse(v).success, 'Enter a valid URL');

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
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['rounds'],
        message: 'Add at least one interview round'
      });
    }
    if (data.salaryMin && data.salaryMax && Number(data.salaryMax) < Number(data.salaryMin)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['salaryMax'],
        message: 'Max must be ≥ min'
      });
    }
    // An interview round can't be scheduled before the day the application was sent.
    if (data.appliedAt) {
      const appliedDayStart = new Date(data.appliedAt);
      appliedDayStart.setHours(0, 0, 0, 0);
      data.rounds.forEach((round, index) => {
        const at = new Date(round.at).getTime();
        if (!Number.isNaN(at) && at < appliedDayStart.getTime()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['rounds', index, 'at'],
            message: 'Cannot be before the applied date'
          });
        }
      });
    }
    // Each round must be strictly later than the round before it.
    for (let i = 1; i < data.rounds.length; i++) {
      const prev = new Date(data.rounds[i - 1].at).getTime();
      const curr = new Date(data.rounds[i].at).getTime();
      if (!Number.isNaN(prev) && !Number.isNaN(curr) && curr <= prev) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['rounds', i, 'at'],
          message: 'Must be after the previous round'
        });
      }
    }
    // Every round except the last must have been passed to justify the round after it:
    //  - a failed round ends the process, so it can't be followed by another round
    //  - a pending round's outcome is unknown, so a later round can't exist yet
    const chronological = data.rounds
      .map((r, index) => ({
        index,
        time: new Date(r.at).getTime(),
        outcome: r.outcome
      }))
      .filter((r) => !Number.isNaN(r.time))
      .sort((a, b) => a.time - b.time);
    chronological.forEach((round, position) => {
      const isLast = position === chronological.length - 1;
      if (isLast || round.outcome === 'passed') return;
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
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

// Form state holds date fields as ISO strings; the pickers convert dayjs ↔ ISO at
// the field boundary. These helpers bridge the two.
const isoToDayjs = (iso?: string) => (iso ? dayjs(iso) : null);
const dayjsToIso = (d: dayjs.Dayjs | null) => (d && d.isValid() ? d.toISOString() : '');

function makeId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const newRound = (): FormValues['rounds'][number] => ({
  id: makeId(),
  at: '',
  name: '',
  outcome: 'pending'
});
const newContact = (): FormValues['contacts'][number] => ({
  id: makeId(),
  name: '',
  role: '',
  email: '',
  phone: ''
});
const newDocument = (): FormValues['documents'][number] => ({
  id: makeId(),
  label: '',
  url: ''
});

function formatNoteTime(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const lgLabelSx = { display: 'block', mb: '4px' } as const;

const LG_INPUT_BORDER = '#889397'; // palette.gray.base — measured border color
const LG_INPUT_BORDER_HOVER = '#5C6C75'; // palette.gray.dark1
const LG_FOCUS_RING = '#0498EC'; // palette.blue.light1
const LG_FOCUS_RING_GLOW = 'rgba(1, 107, 248, 0.12)'; // palette.blue.base @ low alpha

const dateFieldSx = (theme: { palette: { mode: string } }) =>
  ({
    '& .MuiOutlinedInput-root': {
      height: 36,
      borderRadius: '6px',
      fontSize: '13px',
      lineHeight: '20px',
      // Measured LeafyGreen input fill: #112733 (gray.dark4) in dark, white in light.
      bgcolor: theme.palette.mode === 'dark' ? '#112733' : '#FFFFFF',
      transition: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out',
      // Hover: darken the border to match LeafyGreen's hover ring.
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: LG_INPUT_BORDER_HOVER
      },
      // Focus: LeafyGreen swaps the border to blue and adds a soft outer glow.
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: LG_FOCUS_RING,
        borderWidth: '1px'
      },
      '&.Mui-focused': { boxShadow: `0 0 0 3px ${LG_FOCUS_RING_GLOW}` }
    },
    // Hide the floating MUI label — we render our own <LGLabel> above instead.
    '& .MuiInputLabel-root': { display: 'none' },
    '& .MuiOutlinedInput-notchedOutline': {
      // Measured LeafyGreen border: 0.8px solid #889397 (MUI's default was rgba(232,237,235,0.28)).
      borderColor: LG_INPUT_BORDER,
      borderWidth: '0.8px',
      '& legend': { display: 'none' }
    },
    // Match LeafyGreen's 12px horizontal padding and vertically center the text in the 36px box.
    '& .MuiOutlinedInput-input': {
      px: '12px',
      py: 0,
      height: '100%',
      boxSizing: 'border-box'
    }
  }) as const;

export default function JobFormDrawer({ open, mode, initialValues, onClose, onSubmit }: JobFormDrawerProps) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY
  });

  const rounds = useFieldArray({ control, name: 'rounds' });
  const contacts = useFieldArray({ control, name: 'contacts' });
  const documents = useFieldArray({ control, name: 'documents' });

  const status = watch('status');
  const favorite = watch('favorite');
  const watchedRounds = watch('rounds');

  // A next round can only be added once the latest round has passed. While it's still
  // pending you don't yet know the outcome; if it failed, the process has ended.
  const lastRoundOutcome = watchedRounds && watchedRounds.length > 0 ? watchedRounds[watchedRounds.length - 1].outcome : null;

  // Date-picker bounds: you can't have applied in the future, and an interview round
  // can't be scheduled before the application date.
  const appliedAtValue = watch('appliedAt');
  const appliedAtDay = appliedAtValue ? dayjs(appliedAtValue) : null;

  // Each round must come strictly after the previous one (and not before the applied
  // day). Returns the earliest selectable moment for the round at `index`.
  const roundMinDateTime = (index: number) => {
    let min = appliedAtDay ? appliedAtDay.startOf('day') : null;
    const prev = index > 0 ? watchedRounds?.[index - 1]?.at : undefined;
    if (prev) {
      const prevDay = dayjs(prev);
      if (prevDay.isValid()) {
        const after = prevDay.add(1, 'minute');
        min = min && min.isAfter(after) ? min : after;
      }
    }
    return min ?? undefined;
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
        rounds: (initialValues.rounds ?? []).map((r) => ({
          id: r.id,
          at: r.at,
          name: r.name ?? '',
          outcome: r.outcome
        })),
        contacts: (initialValues.contacts ?? []).map((c) => ({
          id: c.id,
          name: c.name ?? '',
          role: c.role ?? '',
          email: c.email ?? '',
          phone: c.phone ?? ''
        })),
        documents: (initialValues.documents ?? []).map((d) => ({
          id: d.id,
          label: d.label ?? '',
          url: d.url ?? ''
        })),
        newNote: ''
      });
    } else {
      reset(EMPTY);
    }
  }, [open, mode, initialValues, reset]);

  const submit = handleSubmit(async (values) => {
    const cleanRounds: InterviewRound[] = values.rounds.map((r) => ({
      id: r.id,
      at: r.at, // already an ISO string from the picker
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
      .map((d) => ({
        id: d.id,
        label: d.label?.trim() || 'Document',
        url: d.url!.trim()
      }));

    // Append the new note (if any) to the existing log.
    const notes: JobNote[] = [...existingNotes];
    if (values.newNote?.trim()) {
      notes.unshift({
        id: makeId(),
        text: values.newNote.trim(),
        createdAt: Date.now()
      });
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
      appliedAt: values.appliedAt || undefined, // already an ISO string from the picker
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
    // LeafyGreen overlay drawers position `absolute` against their parent container, so inside the
    // page content they overlap/clip against the right-side icon rail. Pin the drawer's <dialog> to
    // the viewport's right edge (fixed) so it slides in from the actual screen edge, above the rail.
    <Box
      sx={{
        [`& .${LGDrawerClassName}`]: {
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100dvh',
          zIndex: (theme) => theme.zIndex.drawer + 2
        }
      }}
    >
      {/* LeafyGreen Drawer (overlay) provides its own title header + close button. Padding/scroll are
          disabled so our flex layout keeps a scrollable body with a pinned footer. */}
      <LGDrawer
        open={open}
        displayMode={LGDrawerDisplayMode.Overlay}
        size={LGDrawerSize.Large}
        title={mode === 'edit' ? 'Edit Job' : 'Add Job'}
        onClose={onClose}
        hasPadding={false}
        scrollable={false}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Body */}
            <Box
              component="form"
              onSubmit={submit}
              noValidate
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0
              }}
            >
              <Stack spacing={2.5} sx={{ p: 2.5, flex: 1, overflowY: 'auto' }}>
                {/* Basics */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <LGTextInput
                      label="Company name"
                      state={errors.companyName ? LGTextInputState.Error : LGTextInputState.None}
                      errorMessage={errors.companyName?.message}
                      {...register('companyName')}
                    />
                  </Box>
                  <Controller
                    name="favorite"
                    control={control}
                    render={({ field }) => (
                      <IconButton
                        onClick={() => field.onChange(!field.value)}
                        color={favorite ? 'warning' : 'default'}
                        aria-label="toggle favorite"
                        sx={{ mt: 3.5 }}
                      >
                        {field.value ? <IconStarFilled size={22} /> : <IconStar size={22} />}
                      </IconButton>
                    )}
                  />
                </Box>
                <LGTextInput
                  label="Job title"
                  state={errors.jobTitle ? LGTextInputState.Error : LGTextInputState.None}
                  errorMessage={errors.jobTitle?.message}
                  {...register('jobTitle')}
                />
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <LGSelect label="Status" name={field.name} value={field.value} onChange={(value) => field.onChange(value)}>
                          {JOB_STATUS_ORDER.map((value) => (
                            <LGOption key={value} value={value}>
                              {JOB_STATUS_CONFIG[value].label}
                            </LGOption>
                          ))}
                        </LGSelect>
                      )}
                    />
                  </Box>
                  <Box sx={{ width: 200, flexShrink: 0 }}>
                    {/* Real LeafyGreen Label so this MUI date picker's label block matches the
                        LeafyGreen inputs pixel-for-pixel (label above, not a floating inside-label). */}
                    <Box component={LGLabel} htmlFor="appliedAt" sx={lgLabelSx}>
                      Applied on
                    </Box>
                    <Controller
                      name="appliedAt"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={isoToDayjs(field.value)}
                          onChange={(d) => field.onChange(dayjsToIso(d))}
                          disableFuture
                          slotProps={{
                            textField: {
                              id: 'appliedAt',
                              fullWidth: true,
                              size: 'small',
                              sx: dateFieldSx
                            }
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>

                {/* Compensation & location */}
                <Divider textAlign="left" sx={{ color: 'text.secondary', typography: 'caption' }}>
                  Compensation & location
                </Divider>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <LGTextInput
                      label="Salary min"
                      type="number"
                      state={errors.salaryMin ? LGTextInputState.Error : LGTextInputState.None}
                      errorMessage={errors.salaryMin?.message}
                      {...register('salaryMin')}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <LGTextInput
                      label="Salary max"
                      type="number"
                      state={errors.salaryMax ? LGTextInputState.Error : LGTextInputState.None}
                      errorMessage={errors.salaryMax?.message}
                      {...register('salaryMax')}
                    />
                  </Box>
                  <Box sx={{ maxWidth: 120 }}>
                    <LGTextInput label="Currency" placeholder="₹ / $ / USD" {...register('salaryCurrency')} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <LGTextInput label="Location" placeholder="City or region" {...register('location')} />
                  </Box>
                  <Box sx={{ maxWidth: 180, flex: 1 }}>
                    <Controller
                      name="workMode"
                      control={control}
                      render={({ field }) => (
                        <LGSelect
                          label="Work mode"
                          name={field.name}
                          value={field.value ?? ''}
                          onChange={(value) => field.onChange(value)}
                          allowDeselect
                          placeholder="—"
                        >
                          {WORK_MODE_ORDER.map((value) => (
                            <LGOption key={value} value={value}>
                              {WORK_MODE_CONFIG[value].label}
                            </LGOption>
                          ))}
                        </LGSelect>
                      )}
                    />
                  </Box>
                </Box>

                {/* Source */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ maxWidth: 180, flex: 1 }}>
                    <Controller
                      name="source"
                      control={control}
                      render={({ field }) => (
                        <LGSelect
                          label="Source"
                          name={field.name}
                          value={field.value ?? ''}
                          onChange={(value) => field.onChange(value)}
                          allowDeselect
                          placeholder="—"
                        >
                          {JOB_SOURCE_ORDER.map((value) => (
                            <LGOption key={value} value={value}>
                              {JOB_SOURCE_CONFIG[value].label}
                            </LGOption>
                          ))}
                        </LGSelect>
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <LGTextInput
                      label="Source URL"
                      placeholder="Link to the posting"
                      state={errors.sourceUrl ? LGTextInputState.Error : LGTextInputState.None}
                      errorMessage={errors.sourceUrl?.message}
                      {...register('sourceUrl')}
                    />
                  </Box>
                </Box>

                <LGTextArea label="Job description" rows={3} {...register('jobDescription')} />

                {/* Interview rounds */}
                <Divider textAlign="left" sx={{ color: 'text.secondary', typography: 'caption' }}>
                  Interview rounds
                  {status === 'interviewing' ? '' : ' (optional)'}
                </Divider>
                {rounds.fields.length === 0 && (
                  <Typography variant="body2" color={roundsError ? 'error' : 'text.secondary'}>
                    {roundsError ?? 'No rounds yet. Add one for each interview stage.'}
                  </Typography>
                )}
                {rounds.fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Round {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => rounds.remove(index)}
                          aria-label={`remove round ${index + 1}`}
                        >
                          <IconTrash size={16} />
                        </IconButton>
                      </Box>
                      <Box>
                        <Box component={LGLabel} htmlFor={`rounds.${index}.at`} sx={lgLabelSx}>
                          Date &amp; time
                        </Box>
                        <Controller
                          name={`rounds.${index}.at` as const}
                          control={control}
                          render={({ field: atField }) => (
                            <DateTimePicker
                              value={isoToDayjs(atField.value)}
                              onChange={(d) => atField.onChange(dayjsToIso(d))}
                              minDateTime={roundMinDateTime(index)}
                              slotProps={{
                                textField: {
                                  id: `rounds.${index}.at`,
                                  required: true,
                                  fullWidth: true,
                                  size: 'small',
                                  sx: dateFieldSx,
                                  error: Boolean(errors.rounds?.[index]?.at),
                                  helperText: errors.rounds?.[index]?.at?.message
                                }
                              }}
                            />
                          )}
                        />
                      </Box>
                      <Controller
                        name={`rounds.${index}.name` as const}
                        control={control}
                        render={({ field: nameField }) => (
                          <Autocomplete
                            freeSolo
                            options={INTERVIEW_ROUND_NAME_OPTIONS}
                            size="small"
                            value={nameField.value ?? ''}
                            onChange={(_, newValue) => nameField.onChange(newValue ?? '')}
                            onInputChange={(_, newInput) => nameField.onChange(newInput)}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Round name"
                                placeholder="Pick or type a round name…"
                                inputRef={nameField.ref}
                                onBlur={nameField.onBlur}
                              />
                            )}
                          />
                        )}
                      />
                      <Controller
                        name={`rounds.${index}.outcome` as const}
                        control={control}
                        render={({ field: outcomeField }) => (
                          <LGSelect
                            label="Outcome"
                            size="small"
                            name={outcomeField.name}
                            value={outcomeField.value}
                            onChange={(value) => outcomeField.onChange(value)}
                            state={errors.rounds?.[index]?.outcome ? LGSelectState.Error : LGSelectState.None}
                            errorMessage={errors.rounds?.[index]?.outcome?.message}
                          >
                            {INTERVIEW_OUTCOME_ORDER.map((value) => (
                              <LGOption key={value} value={value}>
                                {INTERVIEW_OUTCOME_CONFIG[value].label}
                              </LGOption>
                            ))}
                          </LGSelect>
                        )}
                      />
                    </Stack>
                  </Box>
                ))}
                {rounds.fields.length >= MAX_ROUNDS ? (
                  <Typography variant="caption" color="text.secondary">
                    Maximum of {MAX_ROUNDS} rounds reached.
                  </Typography>
                ) : lastRoundOutcome === 'failed' ? (
                  <Typography variant="caption" color="text.secondary">
                    The last round was failed — no further rounds can be added.
                  </Typography>
                ) : lastRoundOutcome === 'pending' ? (
                  <Typography variant="caption" color="text.secondary">
                    Mark the last round as passed before adding the next one.
                  </Typography>
                ) : (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<IconPlus size={16} />}
                    onClick={() => rounds.append(newRound())}
                    sx={{ alignSelf: 'flex-start' }}
                  >
                    Add round
                  </Button>
                )}

                {/* Contacts */}
                <Divider textAlign="left" sx={{ color: 'text.secondary', typography: 'caption' }}>
                  Contacts (optional)
                </Divider>
                {contacts.fields.map((field, index) => (
                  <Box
                    key={field.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact {index + 1}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => contacts.remove(index)}
                          aria-label={`remove contact ${index + 1}`}
                        >
                          <IconTrash size={16} />
                        </IconButton>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <LGTextInput label="Name" sizeVariant="small" {...register(`contacts.${index}.name` as const)} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <LGTextInput
                            label="Role"
                            sizeVariant="small"
                            placeholder="Recruiter…"
                            {...register(`contacts.${index}.role` as const)}
                          />
                        </Box>
                      </Box>
                      <LGTextInput
                        label="Email"
                        sizeVariant="small"
                        state={errors.contacts?.[index]?.email ? LGTextInputState.Error : LGTextInputState.None}
                        errorMessage={errors.contacts?.[index]?.email?.message}
                        {...register(`contacts.${index}.email` as const)}
                      />
                      <LGTextInput
                        label="Phone"
                        sizeVariant="small"
                        state={errors.contacts?.[index]?.phone ? LGTextInputState.Error : LGTextInputState.None}
                        errorMessage={errors.contacts?.[index]?.phone?.message}
                        {...register(`contacts.${index}.phone` as const)}
                      />
                    </Stack>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconPlus size={16} />}
                  onClick={() => contacts.append(newContact())}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add contact
                </Button>

                {/* Documents */}
                <Divider textAlign="left" sx={{ color: 'text.secondary', typography: 'caption' }}>
                  Documents (optional)
                </Divider>
                {documents.fields.map((field, index) => (
                  <Box key={field.id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box sx={{ maxWidth: 160 }}>
                      <LGTextInput
                        label="Label"
                        sizeVariant="small"
                        placeholder="Resume v3"
                        {...register(`documents.${index}.label` as const)}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <LGTextInput
                        label="Link"
                        sizeVariant="small"
                        placeholder="https://…"
                        state={errors.documents?.[index]?.url ? LGTextInputState.Error : LGTextInputState.None}
                        errorMessage={errors.documents?.[index]?.url?.message}
                        {...register(`documents.${index}.url` as const)}
                      />
                    </Box>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => documents.remove(index)}
                      aria-label={`remove document ${index + 1}`}
                      sx={{ mt: 3 }}
                    >
                      <IconTrash size={16} />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<IconPlus size={16} />}
                  onClick={() => documents.append(newDocument())}
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add document
                </Button>

                {/* Notes / activity log */}
                <Divider textAlign="left" sx={{ color: 'text.secondary', typography: 'caption' }}>
                  Notes
                </Divider>
                <LGTextArea label="Add a note" rows={2} placeholder="Add to the activity log…" {...register('newNote')} />
                {existingNotes.length > 0 && (
                  <Stack spacing={1}>
                    {existingNotes.map((note) => (
                      <Box
                        key={note.id}
                        sx={{
                          p: 1.25,
                          borderRadius: 1.5,
                          bgcolor: 'action.hover'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {formatNoteTime(note.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {note.text}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Stack>

              {/* Footer */}
              <Divider />
              <Stack direction="row" spacing={1.5} justifyContent="flex-end" sx={{ p: 2.5 }}>
                <Button color="inherit" onClick={onClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {mode === 'edit' ? 'Save changes' : 'Add job'}
                </Button>
              </Stack>
            </Box>
          </Box>
        </LocalizationProvider>
      </LGDrawer>
    </Box>
  );
}
