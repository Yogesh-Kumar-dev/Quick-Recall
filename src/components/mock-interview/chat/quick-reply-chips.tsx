import { ChipFilter } from '@/components/job-tracker/chip-filter';

// A row of selectable chips for a single chat step, plus an optional trailing action chip
// (e.g. "Continue") that only renders once the caller decides the step is satisfiable.

export function QuickReplyChips<T extends string>({
  options,
  selected,
  onToggle,
  action
}: {
  options: { value: T; label: string }[];
  selected: T[];
  onToggle: (value: T) => void;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <ChipFilter key={o.value} active={selected.includes(o.value)} label={o.label} onClick={() => onToggle(o.value)} />
      ))}
      {action && <ChipFilter active={false} label={action.label} onClick={action.onClick} />}
    </div>
  );
}
