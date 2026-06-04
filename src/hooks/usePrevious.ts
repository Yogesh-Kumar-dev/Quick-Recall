'use client';

import { useEffect, useRef } from 'react';

// ==============================|| HOOKS - PREVIOUS ||============================== //

/**
 * Returns the value `value` had on the previous render (undefined on first
 * render). Works because the ref is written in an effect, which runs *after*
 * render — so during render the ref still holds the prior value.
 */
export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
