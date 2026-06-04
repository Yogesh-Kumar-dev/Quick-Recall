'use client';

import { useEffect, useRef, useState } from 'react';

// ==============================|| HOOKS - THROTTLE ||============================== //

/**
 * Returns a throttled copy of `value` that updates at most once every
 * `interval`ms. Unlike debounce (which waits for quiet), throttle emits on a
 * fixed cadence — ideal for scroll / mousemove / resize values.
 */
export default function useThrottle<T>(value: T, interval = 500): T {
  const [throttled, setThrottled] = useState(value);
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const elapsed = Date.now() - lastRun.current;
    if (elapsed >= interval) {
      lastRun.current = Date.now();
      setThrottled(value);
    } else {
      const id = setTimeout(() => {
        lastRun.current = Date.now();
        setThrottled(value);
      }, interval - elapsed);
      return () => clearTimeout(id);
    }
  }, [value, interval]);

  return throttled;
}
