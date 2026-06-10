'use client';

import { useEffect } from 'react';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';

// third party
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// project imports
import { useDispatch } from 'store';
import { startTimer } from 'store/slices/timer';
import { useNotify } from 'notifications/NotificationProvider';
import { COUNTDOWN_PRESETS, POMODORO_DEFAULTS, TIMER_PURPOSE_OPTIONS } from './timerConfig';

// ==============================|| UNIVERSAL TIMER - CONFIG MODAL ||============================== //

const minutesField = z.coerce.number().int().min(1, 'Min 1 minute').max(180, 'Max 180 minutes');

const schema = z.object({
  label: z.string().min(1, 'Tell the timer what it’s for'),
  purpose: z.string(),
  mode: z.enum(['countdown', 'pomodoro']),
  minutes: minutesField,
  focusMinutes: minutesField,
  breakMinutes: minutesField,
  cycles: z.coerce.number().int().min(1, 'Min 1').max(12, 'Max 12')
});

type FormValues = z.infer<typeof schema>;

const EMPTY: FormValues = {
  label: '',
  purpose: '',
  mode: 'countdown',
  minutes: 25,
  focusMinutes: POMODORO_DEFAULTS.focusMinutes,
  breakMinutes: POMODORO_DEFAULTS.breakMinutes,
  cycles: POMODORO_DEFAULTS.cycles
};

interface TimerFormModalProps {
  open: boolean;
  onClose: () => void;
}

export default function TimerFormModal({ open, onClose }: TimerFormModalProps) {
  const dispatch = useDispatch();
  const { requestPermission } = useNotify();

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: EMPTY });

  const mode = watch('mode');
  const purpose = watch('purpose');

  // A break is a one-off rest, not a cycle of work blocks — Pomodoro makes no sense
  // for it. Disable that mode and snap back to countdown if it was already selected.
  const isBreak = (purpose ?? '').trim().toLowerCase() === 'break';
  useEffect(() => {
    if (isBreak && mode === 'pomodoro') setValue('mode', 'countdown');
  }, [isBreak, mode, setValue]);

  const submit = handleSubmit(async (values) => {
    // Drive the OS permission off the user's explicit "start" gesture.
    await requestPermission();

    if (values.mode === 'pomodoro') {
      dispatch(
        startTimer({
          mode: 'pomodoro',
          label: values.label,
          purpose: values.purpose,
          totalSeconds: values.focusMinutes * 60,
          pomodoro: { focusMinutes: values.focusMinutes, breakMinutes: values.breakMinutes, cycles: values.cycles }
        })
      );
    } else {
      dispatch(
        startTimer({
          mode: 'countdown',
          label: values.label,
          purpose: values.purpose,
          totalSeconds: values.minutes * 60
        })
      );
    }
    reset(EMPTY);
    onClose();
  });

  const handleClose = () => {
    reset(EMPTY);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Start a timer</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            label="What’s this timer for?"
            placeholder="e.g. Two Sum — optimal solve"
            fullWidth
            autoFocus
            {...register('label')}
            error={Boolean(errors.label)}
            helperText={errors.label?.message}
          />

          <Controller
            control={control}
            name="purpose"
            render={({ field }) => (
              <Autocomplete
                freeSolo
                options={TIMER_PURPOSE_OPTIONS}
                value={field.value ?? ''}
                onChange={(_, newValue) => field.onChange(newValue ?? '')}
                onInputChange={(_, newInput) => field.onChange(newInput)}
                renderInput={(params) => (
                  <TextField {...params} label="Purpose" placeholder="Pick or type a purpose…" inputRef={field.ref} onBlur={field.onBlur} />
                )}
              />
            )}
          />

          <Controller
            control={control}
            name="mode"
            render={({ field }) => (
              <ToggleButtonGroup exclusive fullWidth size="small" value={field.value} onChange={(_, val) => val && field.onChange(val)}>
                <ToggleButton value="countdown">Countdown</ToggleButton>
                <Tooltip title={isBreak ? 'Pomodoro isn’t available for a break' : ''} placement="top">
                  {/* span wrapper so the tooltip still works while the button is disabled */}
                  <span style={{ flex: 1, display: 'flex', cursor: isBreak ? 'not-allowed' : undefined }}>
                    <ToggleButton value="pomodoro" disabled={isBreak} sx={{ flex: 1 }}>
                      Pomodoro
                    </ToggleButton>
                  </span>
                </Tooltip>
              </ToggleButtonGroup>
            )}
          />

          {mode === 'countdown' ? (
            <Box>
              <TextField
                label="Minutes"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 180 }}
                {...register('minutes')}
                error={Boolean(errors.minutes)}
                helperText={errors.minutes?.message}
              />
              <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                {COUNTDOWN_PRESETS.map((m) => (
                  <Chip key={m} label={`${m}m`} size="small" onClick={() => setValue('minutes', m, { shouldValidate: true })} />
                ))}
              </Stack>
            </Box>
          ) : (
            <Stack direction="row" spacing={1.5}>
              <TextField
                label="Focus (min)"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 180 }}
                {...register('focusMinutes')}
                error={Boolean(errors.focusMinutes)}
                helperText={errors.focusMinutes?.message}
              />
              <TextField
                label="Break (min)"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 180 }}
                {...register('breakMinutes')}
                error={Boolean(errors.breakMinutes)}
                helperText={errors.breakMinutes?.message}
              />
              <TextField
                label="Cycles"
                type="number"
                fullWidth
                inputProps={{ min: 1, max: 12 }}
                {...register('cycles')}
                error={Boolean(errors.cycles)}
                helperText={errors.cycles?.message}
              />
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={submit} disabled={isSubmitting}>
          Start
        </Button>
      </DialogActions>
    </Dialog>
  );
}
