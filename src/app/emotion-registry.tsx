'use client';

import { cache } from '@leafygreen-ui/emotion';
import { useServerInsertedHTML } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

// LeafyGreen's own @emotion/css instance only fills cache.inserted in memory on the server — the
// <style> never reaches the HTML without this flush, causing an unstyled flash until hydration.
export default function EmotionRegistry({ children }: { children: ReactNode }) {
  const flushed = useRef<Set<string>>(null);
  if (flushed.current === null) flushed.current = new Set();

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted).filter((n) => !flushed.current?.has(n) && typeof cache.inserted[n] === 'string');
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      flushed.current?.add(name);
      styles += cache.inserted[name];
    }
    // biome-ignore lint/security/noDangerouslySetInnerHtml: CSS comes from LeafyGreen's own emotion cache, not user input — the standard emotion SSR pattern.
    return <style data-emotion={`${cache.key} ${names.join(' ')}`} dangerouslySetInnerHTML={{ __html: styles }} />;
  });

  return children;
}
