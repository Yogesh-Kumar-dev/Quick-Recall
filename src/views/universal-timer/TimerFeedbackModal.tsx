'use client';

// material-ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// ==============================|| UNIVERSAL TIMER - COMPLETION FEEDBACK ||============================== //

// Shown when a timer finishes naturally (reaches zero). A quick moment-of-reflection
// prompt — the answer isn't persisted, just acknowledged with an encouraging message.

export type TimerOutcome = 'achieved' | 'fell-short';

interface TimerFeedbackModalProps {
  open: boolean;
  /** The timer's label/purpose, for a personalised prompt. */
  name?: string;
  onRespond: (outcome: TimerOutcome) => void;
}

export default function TimerFeedbackModal({ open, name, onRespond }: TimerFeedbackModalProps) {
  return (
    <Dialog open={open} maxWidth="xs" fullWidth>
      <DialogTitle>Time’s up!</DialogTitle>
      <DialogContent>
        <DialogContentText>How did {name ? `“${name}”` : 'it'} go?</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={() => onRespond('fell-short')}>
          Ran out of time ⏳
        </Button>
        <Button variant="contained" onClick={() => onRespond('achieved')}>
          Nailed it 🎯
        </Button>
      </DialogActions>
    </Dialog>
  );
}
