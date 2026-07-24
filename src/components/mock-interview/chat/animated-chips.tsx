'use client';

import { useEffect, useState } from 'react';
import { ChipFilter } from '@/components/job-tracker/chip-filter';
import { cn } from '@/lib/utils';

// Animated chip row: chips appear one by one with a staggered delay after the question finishes typing.

interface AnimatedChipsProps<T extends string> {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  action?: { label: string; onClick: () => void };
  staggerDelay?: number;
  enabled?: boolean;
}

export function AnimatedChips<T extends string>({
  options,
  selected,
  onToggle,
  action,
  staggerDelay = 80,
  enabled = true
}: AnimatedChipsProps<T>) {
  const [visibleCount, setVisibleCount] = useState(0);
  const totalItems = action ? options.length + 1 : options.length;

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reset count when disabled, increment when enabled
  useEffect(() => {
    if (!enabled || prefersReduced) {
      setVisibleCount(0);
      return;
    }

    if (visibleCount >= totalItems) return;

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1);
    }, staggerDelay);

    return () => clearTimeout(timer);
  }, [enabled, visibleCount, totalItems, staggerDelay, prefersReduced]);

  // Show all chips instantly if reduced motion or disabled (but hidden)
  if (prefersReduced) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <ChipFilter key={o.value} active={selected.includes(o.value)} label={o.label} onClick={() => onToggle(o.value)} />
        ))}
        {action && <ChipFilter active={false} label={action.label} onClick={action.onClick} />}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o, i) => {
        const visible = enabled && i < visibleCount;
        return (
          <div
            key={o.value}
            className={cn(
              'transition-all duration-200',
              visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
            )}
          >
            <ChipFilter active={selected.includes(o.value)} label={o.label} onClick={() => onToggle(o.value)} />
          </div>
        );
      })}
      {action &&
        (() => {
          const visible = enabled && visibleCount > options.length;
          return (
            <div
              className={cn(
                'transition-all duration-200',
                visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'
              )}
            >
              <ChipFilter active={false} label={action.label} onClick={action.onClick} />
            </div>
          );
        })()}
    </div>
  );
}
