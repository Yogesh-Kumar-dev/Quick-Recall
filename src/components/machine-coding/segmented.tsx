'use client';

import { cn } from '@/lib/utils';

interface Props {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Segmented pill control — fully rounded (stadium/capsule shape), so the machine-coding
// approach/version picker is visually identical to the Details|Code tabs beside it — mirrors legacy's
// `segmentedControlSx` (borderRadius: 999), where both toolbars shared one style.
export default function Segmented({ options, value, onChange, className }: Props) {
  return (
    <div className={cn('inline-flex h-8 w-fit items-center justify-center rounded-full bg-background p-[3px]', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex h-[calc(100%-1px)] items-center justify-center rounded-full border border-transparent px-2.5 text-sm font-medium whitespace-nowrap transition-all',
            o.value === value ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
