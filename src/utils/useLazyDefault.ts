'use client';

import { type ComponentType, useEffect, useRef, useState } from 'react';

// Dynamically import a component's default export after mount, returning it once ready (null until
// then). Lets a lightweight fallback render first while a heavy client-only dependency (e.g. the
// LeafyGreen Code highlighter, which bundles highlight.js) stays out of First-Load JS and loads in
// its own async chunk. The import target is fixed per call site, so it's resolved once on mount.
export function useLazyDefault<P>(importFn: () => Promise<{ default: ComponentType<P> }>): ComponentType<P> | null {
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);
  const importRef = useRef(importFn);

  useEffect(() => {
    let active = true;
    importRef.current().then((m) => {
      if (active) setComponent(() => m.default);
    });
    return () => {
      active = false;
    };
  }, []);

  return Component;
}
