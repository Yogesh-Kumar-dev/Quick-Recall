'use client';

import { Clock, Pause, Play, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useTimerStore } from '@/stores/timer';
import { formatClock } from './config';
import TimerFormDialog from './timer-form-dialog';
import { useTimerTick } from './use-timer-tick';

// Header universal timer. Always mounted (layout header), so it drives the tick and
// survives route navigation.
export default function TimerSection() {
  useTimerTick();

  const status = useTimerStore((s) => s.status);
  const mode = useTimerStore((s) => s.mode);
  const phase = useTimerStore((s) => s.phase);
  const label = useTimerStore((s) => s.label);
  const purpose = useTimerStore((s) => s.purpose);
  const remainingSeconds = useTimerStore((s) => s.remainingSeconds);
  const currentCycle = useTimerStore((s) => s.currentCycle);
  const cycles = useTimerStore((s) => s.pomodoro?.cycles);
  const pause = useTimerStore((s) => s.pause);
  const resume = useTimerStore((s) => s.resume);
  const reset = useTimerStore((s) => s.reset);

  const [formOpen, setFormOpen] = useState(false);
  const [confirmStopOpen, setConfirmStopOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [finishedName, setFinishedName] = useState('');

  const active = status === 'running' || status === 'paused';

  // Detect the natural finish (→ 'completed') and prompt for feedback, capturing the
  // name before reset clears it.
  const prevStatus = useRef(status);
  useEffect(() => {
    if (prevStatus.current !== 'completed' && status === 'completed') {
      setFinishedName(label || purpose || '');
      setFeedbackOpen(true);
    }
    prevStatus.current = status;
  }, [status, label, purpose]);

  const respondFeedback = (achieved: boolean) => {
    setFeedbackOpen(false);
    reset();
    if (achieved) toast.success('Nice work — onto the next one! 🎯');
    else toast('No worries — progress is progress. Try another block? ⏳');
  };

  if (active) {
    const phaseLabel = mode === 'pomodoro' ? (phase === 'focus' ? 'Focus' : 'Break') : label || 'Timer';
    return (
      <div className="ml-auto flex items-center gap-1 rounded-md border bg-muted/50 px-2 py-0.5">
        <Clock className="size-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 leading-tight">
          <div className="font-mono text-sm font-semibold tabular-nums">{formatClock(remainingSeconds)}</div>
          <div className="truncate text-[10px] text-muted-foreground">
            {phaseLabel}
            {mode === 'pomodoro' && cycles ? ` · ${currentCycle}/${cycles}` : ''}
          </div>
        </div>
        {status === 'running' ? (
          <Button variant="ghost" size="icon-sm" onClick={pause} aria-label="Pause timer">
            <Pause className="size-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon-sm" onClick={resume} aria-label="Resume timer">
            <Play className="size-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon-sm" onClick={() => setConfirmStopOpen(true)} aria-label="Stop timer">
          <X className="size-4" />
        </Button>

        {/* Stop confirmation — offer pausing as the gentler alternative. */}
        <Dialog open={confirmStopOpen} onOpenChange={setConfirmStopOpen}>
          <DialogContent className="sm:max-w-xs">
            <DialogHeader>
              <DialogTitle>Stop this timer?</DialogTitle>
              <DialogDescription>Stopping ends the timer and clears it. If you just need a moment, pause it instead.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => {
                  if (status === 'running') pause();
                  setConfirmStopOpen(false);
                }}
              >
                Pause instead
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setConfirmStopOpen(false);
                  reset();
                }}
              >
                Yes, stop
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <FeedbackDialog open={feedbackOpen} name={finishedName} onRespond={respondFeedback} />
      </div>
    );
  }

  return (
    <div className="ml-auto">
      <Button variant="outline" size="sm" className={cn('gap-1.5')} onClick={() => setFormOpen(true)}>
        <Clock className="size-4" />
        Timer
      </Button>
      <TimerFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <FeedbackDialog open={feedbackOpen} name={finishedName} onRespond={respondFeedback} />
    </div>
  );
}

// Shown when a timer finishes naturally. A quick moment-of-reflection prompt — not
// persisted, just acknowledged with an encouraging toast.
function FeedbackDialog({ open, name, onRespond }: { open: boolean; name: string; onRespond: (achieved: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onRespond(false)}>
      <DialogContent className="sm:max-w-xs">
        <DialogHeader>
          <DialogTitle>Time’s up!</DialogTitle>
          <DialogDescription>How did {name ? `“${name}”` : 'it'} go?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onRespond(false)}>
            Ran out of time ⏳
          </Button>
          <Button onClick={() => onRespond(true)}>Nailed it 🎯</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
