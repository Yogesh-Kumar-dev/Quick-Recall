'use client';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// leafygreen (real MongoDB components)
import { LGModal, LGButton } from 'ui-component/leafygreen';

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
    <LGModal open={open} setOpen={() => onRespond('fell-short')} size="small">
      <Typography variant="h4" gutterBottom>
        Time’s up!
      </Typography>
      <Typography variant="body1" color="text.secondary">
        How did {name ? `“${name}”` : 'it'} go?
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 3 }}>
        <LGButton variant="default" onClick={() => onRespond('fell-short')}>
          Ran out of time ⏳
        </LGButton>
        <LGButton variant="primary" onClick={() => onRespond('achieved')}>
          Nailed it 🎯
        </LGButton>
      </Box>
    </LGModal>
  );
}
