'use client';

import { useEffect, useState } from 'react';
import { useVirtualizer } from './virtual-note-list';

export default function VirtualizerDebugPanel({ overscan }: { overscan: number }) {
  const virtualizer = useVirtualizer();
  const [, setTick] = useState(0);

  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      if (raf === null)
        raf = requestAnimationFrame(() => {
          raf = null;
          setTick((t) => t + 1);
        });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  });

  if (!virtualizer) return null;

  const items = virtualizer.getVirtualItems();
  const total = virtualizer.options.count;
  const mounted = items.length;
  const startIndex = items.length > 0 ? items[0].index : 0;
  const endIndex = items.length > 0 ? items[items.length - 1].index : 0;
  const totalSize = virtualizer.getTotalSize();

  return (
    <div className="flex items-center gap-4 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-xs text-muted-foreground">
      <span>
        Total rows <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
      </span>
      <span>
        Mounted <span className="font-semibold text-foreground">{mounted}</span>
      </span>
      <span>
        Visible range{' '}
        <span className="font-semibold text-foreground">
          {startIndex + 1}–{endIndex + 1}
        </span>
      </span>
      <span>
        Overscan <span className="font-semibold text-foreground">{overscan} each side</span>
      </span>
      <span>
        Full scroll range <span className="font-semibold text-foreground">{totalSize.toLocaleString()}px</span>
      </span>
    </div>
  );
}
