'use client';

import { cache } from '@leafygreen-ui/emotion';
import { useServerInsertedHTML } from 'next/navigation';
import { useRef, type ReactNode } from 'react';

// LeafyGreen ships its own @emotion/css instance (key "leafygreen-ui"). On the server that instance
// only fills cache.inserted in memory — the <style> never reaches the HTML, so LeafyGreen markup
// ships classNames with no styles (unstyled flash until hydration). This registry flushes the
// inserted rules into the streamed HTML via useServerInsertedHTML. Needs a single emotion instance
// app-wide — enforced by the React version override in pnpm-workspace.yaml.
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
