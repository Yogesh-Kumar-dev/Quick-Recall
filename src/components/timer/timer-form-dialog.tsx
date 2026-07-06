'use client';

import { useState } from 'react';
import Segmented from '@/components/machine-coding/segmented';
import { requestPermission } from '@/notifications/manager';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useTimerStore } from '@/stores/timer';
import { COUNTDOWN_PRESETS, POMODORO_DEFAULTS, TIMER_PURPOSE_SUGGESTIONS } from './config';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const clampMinutes = (n: number) => Math.min(180, Math.max(1, Math.round(n) || 1));
const clampCycles = (n: number) => Math.min(12, Math.max(1, Math.round(n) || 1));

export default function TimerFormDialog({ open, onOpenChange }: Props) {
  const start = useTimerStore((s) => s.start);

  const [label, setLabel] = useState('');
  const [purpose, setPurpose] = useState('');
  const [mode, setMode] = useState<'countdown' | 'pomodoro'>('countdown');
  const [minutes, setMinutes] = useState(25);
  const [focusMinutes, setFocusMinutes] = useState(POMODORO_DEFAULTS.focusMinutes);
  const [breakMinutes, setBreakMinutes] = useState(POMODORO_DEFAULTS.breakMinutes);
  const [cycles, setCycles] = useState(POMODORO_DEFAULTS.cycles);
  const [labelError, setLabelError] = useState(false);

  // A break is a one-off rest, not a cycle of work blocks — pomodoro makes no sense
  // for it. Force countdown when the purpose is "Break".
  const isBreak = purpose.trim().toLowerCase() === 'break';
  const effectiveMode = isBreak ? 'countdown' : mode;

  const reset = () => {
    setLabel('');
    setPurpose('');
    setMode('countdown');
    setMinutes(25);
    setFocusMinutes(POMODORO_DEFAULTS.focusMinutes);
    setBreakMinutes(POMODORO_DEFAULTS.breakMinutes);
    setCycles(POMODORO_DEFAULTS.cycles);
    setLabelError(false);
  };

  const close = () => {
    reset();
    onOpenChange(false);
  };

  const submit = async () => {
    if (!label.trim()) {
      setLabelError(true);
      return;
    }
    // Drive the OS permission prompt off the user's explicit "start" gesture.
    await requestPermission();
    if (effectiveMode === 'pomodoro') {
      start({
        mode: 'pomodoro',
        label: label.trim(),
        purpose,
        totalSeconds: clampMinutes(focusMinutes) * 60,
        pomodoro: { focusMinutes: clampMinutes(focusMinutes), breakMinutes: clampMinutes(breakMinutes), cycles: clampCycles(cycles) }
      });
    } else {
      start({ mode: 'countdown', label: label.trim(), purpose, totalSeconds: clampMinutes(minutes) * 60 });
    }
    close();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a timer</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <label htmlFor="timer-label" className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">What’s this timer for?</span>
            <Input
              id="timer-label"
              autoFocus
              placeholder="e.g. Two Sum — optimal solve"
              value={label}
              onChange={(e) => {
                setLabel(e.target.value);
                if (labelError) setLabelError(false);
              }}
              aria-invalid={labelError}
            />
            {labelError && <span className="text-xs text-destructive">Tell the timer what it’s for.</span>}
          </label>

          <div className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium">Purpose</span>
            <Input placeholder="Pick or type a purpose…" value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            <div className="flex flex-wrap gap-1.5">
              {TIMER_PURPOSE_SUGGESTIONS.map(({ label: sug, icon: Icon }) => (
                <Button key={sug} type="button" variant="outline" size="sm" className="h-7 gap-1.5" onClick={() => setPurpose(sug)}>
                  <Icon className="size-3.5" />
                  {sug}
                </Button>
              ))}
            </div>
          </div>

          <Segmented
            className="w-full"
            options={[
              { label: 'Countdown', value: 'countdown' },
              // Disabled-for-break is expressed by forcing countdown above; keep both options visible.
              { label: 'Pomodoro', value: 'pomodoro' }
            ]}
            value={effectiveMode}
            onChange={(v) => setMode(v as 'countdown' | 'pomodoro')}
          />

          {effectiveMode === 'countdown' ? (
            <div className="flex flex-col gap-1.5 text-sm">
              <span className="font-medium">Minutes</span>
              <Input type="number" min={1} max={180} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
              <div className="flex gap-1.5">
                {COUNTDOWN_PRESETS.map((m) => (
                  <Button key={m} type="button" variant="outline" size="sm" className="h-7" onClick={() => setMinutes(m)}>
                    {m}m
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-3 text-sm">
              <label htmlFor="timer-focus" className="flex flex-1 flex-col gap-1.5">
                <span className="font-medium">Focus (min)</span>
                <Input
                  id="timer-focus"
                  type="number"
                  min={1}
                  max={180}
                  value={focusMinutes}
                  onChange={(e) => setFocusMinutes(Number(e.target.value))}
                />
              </label>
              <label htmlFor="timer-break" className="flex flex-1 flex-col gap-1.5">
                <span className="font-medium">Break (min)</span>
                <Input
                  id="timer-break"
                  type="number"
                  min={1}
                  max={180}
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value))}
                />
              </label>
              <label htmlFor="timer-cycles" className="flex flex-1 flex-col gap-1.5">
                <span className="font-medium">Cycles</span>
                <Input
                  id="timer-cycles"
                  type="number"
                  min={1}
                  max={12}
                  value={cycles}
                  onChange={(e) => setCycles(Number(e.target.value))}
                />
              </label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={close}>
            Cancel
          </Button>
          <Button onClick={submit}>Start</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
