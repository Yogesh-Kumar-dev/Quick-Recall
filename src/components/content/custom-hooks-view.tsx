'use client';

import { Callout, Variant as CalloutVariant } from '@leafygreen-ui/callout';
import { ExpandableCard } from '@leafygreen-ui/expandable-card';
import { useMemo, useState } from 'react';
import { reactCustomHooks } from '@/data/react/react-custom-hooks';
import type { HookDifficulty, HookDoc } from '@/types/content';
import CodeBlock from './code-block';

const DIFFICULTY_META: { value: HookDifficulty; label: string }[] = [
  { value: 'easy', label: '🟢 Easy' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'advanced', label: '🔴 Advanced' }
];

const CATEGORY_LABELS: Record<string, string> = {
  state: 'State',
  effect: 'Effect',
  ref: 'Ref',
  browser: 'Browser API',
  async: 'Async'
};

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'
      }`}
    >
      {label}
    </button>
  );
}

function HookCard({ hook, open, onToggle }: { hook: HookDoc; open: boolean; onToggle: (id: string) => void }) {
  return (
    <div id={`hook-${hook.id}`} className="mb-2">
      <ExpandableCard
        isOpen={open}
        onClick={() => onToggle(hook.id)}
        title={
          <span className="inline-flex flex-wrap items-center gap-2">
            <span className="font-mono font-bold">{hook.name}</span>
            <span className="rounded-full border border-border px-2 py-0.5 text-xs capitalize text-muted-foreground">
              {hook.difficulty}
            </span>
            <span className="text-sm font-normal text-muted-foreground">{hook.tagline}</span>
          </span>
        }
      >
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{hook.description}</p>

        <div className="mb-4 overflow-x-auto rounded bg-muted p-2 font-mono text-[13px]">{hook.signature}</div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live demo</p>
        <div className="mb-4 rounded-md border border-dashed border-border bg-background p-4">{hook.demo}</div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Implementation</p>
        <div className="mb-4">
          <CodeBlock code={hook.source} language="typescript" />
        </div>

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Usage</p>
        <div className="mb-4">
          <CodeBlock code={hook.usage} language="tsx" />
        </div>

        <p className="mb-1 text-sm font-semibold">When to use it</p>
        <ul className="list-disc space-y-0.5 pl-5 text-sm text-muted-foreground">
          {hook.useCases.map((uc) => (
            <li key={uc}>{uc}</li>
          ))}
        </ul>

        {hook.gotcha && (
          <div className="mt-4">
            <Callout variant={CalloutVariant.Warning} title="Watch out">
              {hook.gotcha}
            </Callout>
          </div>
        )}
      </ExpandableCard>
    </div>
  );
}

export default function CustomHooksView() {
  const [difficulty, setDifficultyState] = useState<HookDifficulty | 'all'>('all');
  const [category, setCategoryState] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);

  // Changing any filter collapses the open card so its id can't point at a now-hidden hook.
  const setDifficulty = (val: HookDifficulty | 'all') => {
    setDifficultyState(val);
    setOpenId(null);
  };
  const setCategory = (val: string) => {
    setCategoryState(val);
    setOpenId(null);
  };
  const handleToggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    reactCustomHooks.forEach((h) => {
      map.set(h.category, (map.get(h.category) ?? 0) + 1);
    });
    return Array.from(map.entries());
  }, []);

  const filtered = useMemo(
    () =>
      reactCustomHooks.filter((h) => {
        const matchDiff = difficulty === 'all' || h.difficulty === difficulty;
        const matchCat = category === 'all' || h.category === category;
        return matchDiff && matchCat;
      }),
    [difficulty, category]
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      <div className="flex items-baseline justify-between gap-2">
        <h1 className="font-heading text-2xl font-bold">🪝 Custom Hooks</h1>
        <span className="text-sm text-muted-foreground">
          {filtered.length} of {reactCustomHooks.length}
        </span>
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Battle-tested reusable hooks asked about in frontend interviews. Each one ships a live demo, the full TypeScript implementation,
        real usage, and the gotcha interviewers probe for. The source mirrors importable hooks under{' '}
        <code className="font-mono">src/hooks/</code>.
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        <Chip active={difficulty === 'all'} label="All" onClick={() => setDifficulty('all')} />
        {DIFFICULTY_META.map((d) => (
          <Chip key={d.value} active={difficulty === d.value} label={d.label} onClick={() => setDifficulty(d.value)} />
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        <Chip active={category === 'all'} label="All categories" onClick={() => setCategory('all')} />
        {categories.map(([cat, count]) => (
          <Chip key={cat} active={category === cat} label={`${CATEGORY_LABELS[cat] ?? cat} (${count})`} onClick={() => setCategory(cat)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No hooks match your filters.</p>
      ) : (
        <div>
          {filtered.map((hook) => (
            <HookCard key={hook.id} hook={hook} open={openId === hook.id} onToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
