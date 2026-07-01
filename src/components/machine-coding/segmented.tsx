'use client';

import { cn } from '@/lib/utils';

interface Props {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// Segmented pill control matching the shadcn TabsList/TabsTrigger look, so the machine-coding
// approach/version picker is visually identical to the Details|Code tabs beside it — mirrors legacy,
// where both toolbars shared one `segmentedControlSx`.
export default function Segmented({ options, value, onChange, className }: Props) {
  return (
    <div className={cn('inline-flex h-8 w-fit items-center justify-center rounded-lg bg-muted p-[3px]', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'inline-flex h-[calc(100%-1px)] items-center justify-center rounded-md border border-transparent px-2.5 text-sm font-medium whitespace-nowrap transition-all',
            o.value === value
              ? 'bg-background text-foreground shadow-sm dark:border-input dark:bg-input/30'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
