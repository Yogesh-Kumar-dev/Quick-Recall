'use client';

import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';
import { useDispatch, useSelector } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { pauseTimer, resetTimer, resumeTimer } from 'store/slices/timer';
import TimerFormModal from 'views/universal-timer/TimerFormModal';
import TimerFeedbackModal from 'views/universal-timer/TimerFeedbackModal';
import type { TimerOutcome } from 'views/universal-timer/TimerFeedbackModal';
import useTimerTick from 'views/universal-timer/useTimerTick';
import { formatClock } from 'views/universal-timer/timerConfig';

// assets
import { IconClock, IconPlayerPause, IconPlayerPlay, IconX } from '@tabler/icons-react';

// ==============================|| HEADER CONTENT - UNIVERSAL TIMER ||============================== //

export default function TimerSection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [finishedName, setFinishedName] = useState('');

  // Drive the countdown from here (always-mounted header).
  useTimerTick();

  const status = useSelector((s) => s.timer?.status);
  const mode = useSelector((s) => s.timer?.mode);
  const phase = useSelector((s) => s.timer?.phase);
  const label = useSelector((s) => s.timer?.label);
  const purpose = useSelector((s) => s.timer?.purpose);
  const remainingSeconds = useSelector((s) => s.timer?.remainingSeconds ?? 0);
  const currentCycle = useSelector((s) => s.timer?.currentCycle ?? 1);
  const cycles = useSelector((s) => s.timer?.pomodoro?.cycles);

  const active = status === 'running' || status === 'paused';

  // Detect the natural finish (… → 'completed') and open the feedback prompt.
  // Capture the name before the slice is reset so the prompt can reference it.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current !== 'completed' && status === 'completed') {
      setFinishedName(label || purpose || '');
      setFeedbackOpen(true);
    }
    prevStatus.current = status;
  }, [status, label, purpose]);

  const handleFeedback = (outcome: TimerOutcome) => {
    setFeedbackOpen(false);
    dispatch(resetTimer());
    dispatch(
      openSnackbar({
        open: true,
        message: outcome === 'achieved' ? 'Nice work — onto the next one! 🎯' : 'No worries — progress is progress. Try another block? ⏳',
        variant: 'alert',
        alert: { color: outcome === 'achieved' ? 'success' : 'info' },
        close: true
      })
    );
  };

  if (active) {
    const phaseLabel = mode === 'pomodoro' ? (phase === 'focus' ? 'Focus' : 'Break') : label || 'Timer';
    return (
      <Box sx={{ ml: 2 }}>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            alignItems: 'center',
            px: 1,
            py: 0.25,
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light'
          }}
        >
          <IconClock size="18px" stroke={1.5} />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.1, color: 'primary.dark', fontWeight: 600 }} noWrap>
              {formatClock(remainingSeconds)}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.1, fontSize: 10, opacity: 0.8 }} noWrap>
              {phaseLabel}
              {mode === 'pomodoro' && cycles ? ` · ${currentCycle}/${cycles}` : ''}
            </Typography>
          </Box>
          {status === 'running' ? (
            <Tooltip title="Pause">
              <IconButton size="small" onClick={() => dispatch(pauseTimer())} aria-label="Pause timer">
                <IconPlayerPause size="16px" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Resume">
              <IconButton size="small" onClick={() => dispatch(resumeTimer())} aria-label="Resume timer">
                <IconPlayerPlay size="16px" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Stop">
            <IconButton size="small" onClick={() => setConfirmStopOpen(true)} aria-label="Stop timer">
              <IconX size="16px" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Stop confirmation — offer pausing as the gentler alternative. */}
        <Dialog
          open={confirmStopOpen}
          // A stray outside click shouldn't dismiss the confirmation; Esc still closes.
          onClose={(_, reason) => {
            if (reason !== 'backdropClick') setConfirmStopOpen(false);
          }}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Stop this timer?</DialogTitle>
          <DialogContent>
            <DialogContentText>Stopping ends the timer and clears it. If you just need a moment, pause it instead.</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              color="inherit"
              onClick={() => {
                if (status === 'running') dispatch(pauseTimer());
                setConfirmStopOpen(false);
              }}
            >
              Pause Instead
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                setConfirmStopOpen(false);
                dispatch(resetTimer());
              }}
            >
              Yes, stop
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ ml: 2 }}>
      <Tooltip title="Start a timer">
        <IconButton
          disableRipple
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            border: '1px solid',
            borderColor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
            bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'primary.light',
            color: 'primary.dark',
            transition: 'all .2s ease-in-out',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.main', color: 'primary.light' }
          }}
          aria-label="Start a timer"
          onClick={() => setModalOpen(true)}
          color="inherit"
        >
          <IconClock stroke={1.5} size="20px" />
        </IconButton>
      </Tooltip>
      <TimerFormModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <TimerFeedbackModal open={feedbackOpen} name={finishedName} onRespond={handleFeedback} />
    </Box>
  );
}
