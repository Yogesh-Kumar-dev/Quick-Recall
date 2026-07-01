'use client';

import { useEffect, useRef, useState } from 'react';

// ==============================|| HOOKS - INTERSECTION OBSERVER ||============================== //

/**
 * Observes the returned ref's element and reports whether it is currently
 * intersecting the viewport (or a custom root). With `freezeOnceVisible`, it
 * stops updating after the first time the element becomes visible — handy for
 * lazy-loading / one-shot reveal animations.
 */
export default function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: IntersectionObserverInit & { freezeOnceVisible?: boolean } = {}
) {
  const { freezeOnceVisible = false, ...observerInit } = options;
  const ref = useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const frozen = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: observerInit is spread fresh each render; keyed on its primitive fields, callers pass stable values
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined' || frozen.current) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && freezeOnceVisible) {
        frozen.current = true;
        observer.disconnect();
      }
    }, observerInit);

    observer.observe(el);

    return () => observer.disconnect();
  }, [freezeOnceVisible, observerInit.root, observerInit.rootMargin, observerInit.threshold]);

  return { ref, isIntersecting } as const;
}
