'use client';

import { useEffect, useState } from 'react';

// ==============================|| HOOKS - DEBOUNCE ||============================== //

/**
 * Returns a debounced copy of `value` that only updates after `delay`ms have
 * passed without `value` changing. Each change resets the timer, so rapid
 * updates (typing) collapse into a single trailing update.
 */
export default function useDebounce<T>(value: T, delay = 500): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
