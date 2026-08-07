'use client';

import { useEffect, useReducer } from 'react';
import { useVirtualizer } from './virtual-note-list';

export default function VirtualizerStats() {
  const virtualizer = useVirtualizer();
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (!virtualizer) return;
    let raf: number | null = null;
    const update = () => {
      raf ??= requestAnimationFrame(() => {
          raf = null;
          forceUpdate();
        });
    };
    // Trigger an immediate tick so stats show on mount and filter reset
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [virtualizer]);

  if (!virtualizer) return null;

  const items = virtualizer.getVirtualItems();
  const mounted = items.length;
  const start = items.length > 0 ? items[0].index + 1 : 0;
  const end = items.length > 0 ? items[items.length - 1].index + 1 : 0;

  return (
    <span className="font-mono text-xs text-muted-foreground">
      {mounted} mounted · {start}–{end}
    </span>
  );
}
